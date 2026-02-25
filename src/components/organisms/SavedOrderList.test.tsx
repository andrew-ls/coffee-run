import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { SavedOrderList } from './SavedOrderList'
import { createSavedOrder, createOrderFormData } from '@/test/fixtures'

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

describe('SavedOrderList', () => {
  it('renders the title', () => {
    render(
      <SavedOrderList
        savedOrders={[]}
        onUsual={vi.fn()}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )
    expect(screen.getByText('Saved Orders')).toBeInTheDocument()
  })

  it('shows empty state message when no saved orders', () => {
    render(
      <SavedOrderList
        savedOrders={[]}
        onUsual={vi.fn()}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )
    expect(screen.getByText(/No saved orders yet/)).toBeInTheDocument()
  })

  it('renders saved order cards', () => {
    const saved = [
      createSavedOrder({ id: 's1', orderData: createOrderFormData({ personName: 'Alice' }) }),
      createSavedOrder({ id: 's2', orderData: createOrderFormData({ personName: 'Bob' }) }),
    ]
    render(
      <SavedOrderList
        savedOrders={saved}
        onUsual={vi.fn()}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('does not show empty message when orders exist', () => {
    const saved = [createSavedOrder({ id: 's1' })]
    render(
      <SavedOrderList
        savedOrders={saved}
        onUsual={vi.fn()}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )
    expect(screen.queryByText(/No saved orders yet/)).not.toBeInTheDocument()
  })

  it('wires onUsual callback to cards', () => {
    const onUsual = vi.fn()
    const saved = [createSavedOrder({ id: 's1' })]
    render(
      <SavedOrderList
        savedOrders={saved}
        onUsual={onUsual}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByText('Usual'))
    expect(onUsual).toHaveBeenCalledWith(saved[0])
  })

  it('wires onCustom callback to cards', () => {
    const onCustom = vi.fn()
    const saved = [createSavedOrder({ id: 's1' })]
    render(
      <SavedOrderList
        savedOrders={saved}
        onUsual={vi.fn()}
        onCustom={onCustom}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByText('Custom'))
    expect(onCustom).toHaveBeenCalledWith(saved[0])
  })

  it('renders drag overlay when a saved order is being dragged', () => {
    const saved = [
      createSavedOrder({ id: 's1', orderData: createOrderFormData({ personName: 'Alice' }) }),
    ]
    render(
      <SavedOrderList
        savedOrders={saved}
        onUsual={vi.fn()}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    act(() => {
      capturedOnDragStart?.({ active: { id: 's1' } })
    })

    // The overlay card for Alice should appear in addition to the list item
    const aliceElements = screen.getAllByText('Alice')
    expect(aliceElements.length).toBeGreaterThan(1)

    // Invoke the no-op callbacks on the overlay card to achieve function coverage
    const usualButtons = screen.getAllByText('Usual')
    const customButtons = screen.getAllByText('Custom')
    const deleteZones = screen.getAllByText('Delete')
    fireEvent.click(usualButtons[usualButtons.length - 1])
    fireEvent.click(customButtons[customButtons.length - 1])
    fireEvent.click(deleteZones[deleteZones.length - 1])
  })
})
