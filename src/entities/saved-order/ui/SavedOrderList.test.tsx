import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SavedOrderList } from './SavedOrderList'
import { createSavedOrder, createOrderFormData } from '@/test/fixtures'

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
  savedOrders: [
    createSavedOrder({ id: 's1', orderData: createOrderFormData({ personName: 'Alice' }) }),
    createSavedOrder({ id: 's2', orderData: createOrderFormData({ personName: 'Bob' }) }),
  ],
  onAdd: vi.fn(),
  onCustomised: vi.fn(),
  onDelete: vi.fn(),
  onReorder: vi.fn(),
}

describe('SavedOrderList', () => {
  it('renders the Saved Orders title', () => {
    render(<SavedOrderList {...defaultProps} />)
    expect(screen.getByText('Saved Orders')).toBeInTheDocument()
  })

  it('renders all saved order cards', () => {
    render(<SavedOrderList {...defaultProps} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('renders empty message when savedOrders is empty', () => {
    render(<SavedOrderList {...defaultProps} savedOrders={[]} />)
    expect(screen.getByText('No Saved Orders yet. Save one from the Order form!')).toBeInTheDocument()
  })

  it('calls onAdd with the correct saved order', () => {
    const onAdd = vi.fn()
    render(<SavedOrderList {...defaultProps} onAdd={onAdd} />)
    const useButtons = screen.getAllByRole('button', { name: 'Use' })
    fireEvent.click(useButtons[0])
    expect(onAdd).toHaveBeenCalledWith(defaultProps.savedOrders[0])
  })

  it('calls onCustomised with the correct saved order', () => {
    const onCustomised = vi.fn()
    render(<SavedOrderList {...defaultProps} onCustomised={onCustomised} />)
    const customButtons = screen.getAllByRole('button', { name: 'Customised' })
    fireEvent.click(customButtons[1])
    expect(onCustomised).toHaveBeenCalledWith(defaultProps.savedOrders[1])
  })

  it('calls onDelete with the correct id', () => {
    const onDelete = vi.fn()
    render(<SavedOrderList {...defaultProps} onDelete={onDelete} />)
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButtons[0])
    expect(onDelete).toHaveBeenCalledWith('s1')
  })
})
