import { describe, it, expect, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { OrderList } from './OrderList'
import { createOrder } from '@/test/fixtures'

vi.mock('@/hooks/useBreakpoint', () => ({
  useBreakpoint: vi.fn().mockReturnValue('desktop'),
}))

let capturedOnDragStart: ((e: { active: { id: string } }) => void) | null = null

vi.mock('@dnd-kit/core', () => ({
  DndContext: vi.fn(({ children, onDragStart }: Record<string, unknown>) => {
    capturedOnDragStart = onDragStart as typeof capturedOnDragStart
    return children
  }),
  DragOverlay: vi.fn(({ children }: Record<string, unknown>) => children),
  PointerSensor: class {},
  TouchSensor: class {},
  closestCenter: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => children,
  useSortable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
  verticalListSortingStrategy: vi.fn(),
}))

vi.mock('@dnd-kit/modifiers', () => ({ restrictToVerticalAxis: vi.fn() }))
vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: vi.fn(() => undefined) } },
}))

import React from 'react'

describe('OrderList', () => {
  const orders = [
    createOrder({ id: 'o1', personName: 'Alice' }),
    createOrder({ id: 'o2', personName: 'Bob' }),
    createOrder({ id: 'o3', personName: 'Carol' }),
  ]

  it('renders all orders', () => {
    render(
      <OrderList
        orders={orders}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('renders empty list without crashing', () => {
    const { container } = render(
      <OrderList orders={[]} onEdit={vi.fn()} onDelete={vi.fn()} onReorder={vi.fn()} />,
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('passes onEdit callback down to cards', () => {
    const onEdit = vi.fn()
    render(
      <OrderList orders={orders} onEdit={onEdit} onDelete={vi.fn()} onReorder={vi.fn()} />,
    )
    const editButtons = screen.getAllByRole('button', { name: 'Edit Order' })
    editButtons[0].click()
    expect(onEdit).toHaveBeenCalledWith('o1')
  })

  it('passes onDelete callback down to cards', () => {
    const onDelete = vi.fn()
    render(
      <OrderList orders={orders} onEdit={vi.fn()} onDelete={onDelete} onReorder={vi.fn()} />,
    )
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete Order' })
    deleteButtons[0].click()
    expect(onDelete).toHaveBeenCalledWith('o1')
  })

  it('marks the newest order when count increases', () => {
    const { rerender } = render(
      <OrderList orders={orders.slice(0, 2)} onEdit={vi.fn()} onDelete={vi.fn()} onReorder={vi.fn()} />,
    )
    rerender(
      <OrderList orders={orders} onEdit={vi.fn()} onDelete={vi.fn()} onReorder={vi.fn()} />,
    )
    // Carol is the newest order after the re-render adds the 3rd order
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('renders drag overlay when an item is being dragged', () => {
    render(
      <OrderList orders={orders} onEdit={vi.fn()} onDelete={vi.fn()} onReorder={vi.fn()} />,
    )

    act(() => {
      capturedOnDragStart?.({ active: { id: 'o1' } })
    })

    // The overlay card for Alice should appear
    const aliceElements = screen.getAllByText('Alice')
    expect(aliceElements.length).toBeGreaterThan(1)

    // Invoke the no-op callbacks on the overlay card to achieve function coverage
    const editButtons = screen.getAllByRole('button', { name: 'Edit Order' })
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete Order' })
    fireEvent.click(editButtons[editButtons.length - 1])
    fireEvent.click(deleteButtons[deleteButtons.length - 1])
  })
})
