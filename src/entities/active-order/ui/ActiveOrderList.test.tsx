import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ActiveOrderList } from './ActiveOrderList'
import { createActiveOrder } from '@/test/fixtures'

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => children,
  DragOverlay: () => null,
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

const defaultProps = {
  orders: [
    createActiveOrder({ id: 'o1', personName: 'Alice' }),
    createActiveOrder({ id: 'o2', personName: 'Bob' }),
  ],
  onToggleDone: vi.fn(),
  onEdit: vi.fn(),
  onRemove: vi.fn(),
  onReorder: vi.fn(),
}

describe('ActiveOrderList', () => {
  it('renders all order cards', () => {
    render(<ActiveOrderList {...defaultProps} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('calls onToggleDone with the correct id', () => {
    const onToggleDone = vi.fn()
    render(<ActiveOrderList {...defaultProps} onToggleDone={onToggleDone} />)
    const doneButtons = screen.getAllByRole('button', { name: 'Mark as done' })
    fireEvent.click(doneButtons[0])
    expect(onToggleDone).toHaveBeenCalledWith('o1')
  })

  it('calls onEdit with the correct id', () => {
    const onEdit = vi.fn()
    render(<ActiveOrderList {...defaultProps} onEdit={onEdit} />)
    const editButtons = screen.getAllByRole('button', { name: 'Edit Order' })
    fireEvent.click(editButtons[1])
    expect(onEdit).toHaveBeenCalledWith('o2')
  })

  it('calls onRemove with the correct id', () => {
    const onRemove = vi.fn()
    render(<ActiveOrderList {...defaultProps} onRemove={onRemove} />)
    const removeButtons = screen.getAllByRole('button', { name: 'Remove Order' })
    fireEvent.click(removeButtons[0])
    expect(onRemove).toHaveBeenCalledWith('o1')
  })
})
