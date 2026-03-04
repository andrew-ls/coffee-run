import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AddOrder } from './AddOrder'
import { createSavedOrder, createOrderFormData } from '@/test/fixtures'
import type { SavedOrder } from '@/entities/saved-order'

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

const mockRemoveSavedOrder = vi.fn()
const mockReorderSavedOrders = vi.fn()
const mockUseSavedOrderContext = vi.fn()

vi.mock('@/app/contexts/SavedOrderContext', () => ({
  useSavedOrderContext: () => mockUseSavedOrderContext(),
}))

const defaultProps = {
  onNewOrder: vi.fn(),
  onUsual: vi.fn(),
  onCustom: vi.fn(),
}

describe('AddOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSavedOrderContext.mockReturnValue({
      savedOrders: [] as SavedOrder[],
      removeSavedOrder: mockRemoveSavedOrder,
      reorderSavedOrders: mockReorderSavedOrders,
    })
  })

  it('renders the title', () => {
    render(<AddOrder {...defaultProps} />)
    expect(screen.getByText('Add Order')).toBeInTheDocument()
  })

  it('renders New Order button', () => {
    render(<AddOrder {...defaultProps} />)
    expect(screen.getByText('New Order')).toBeInTheDocument()
  })

  it('calls onNewOrder when New Order is clicked', () => {
    const onNewOrder = vi.fn()
    render(<AddOrder {...defaultProps} onNewOrder={onNewOrder} />)
    fireEvent.click(screen.getByText('New Order'))
    expect(onNewOrder).toHaveBeenCalledOnce()
  })

  it('shows Saved Orders', () => {
    const saved = [
      createSavedOrder({ id: 's1', orderData: createOrderFormData({ personName: 'Eve' }) }),
    ]
    mockUseSavedOrderContext.mockReturnValue({
      savedOrders: saved,
      removeSavedOrder: mockRemoveSavedOrder,
      reorderSavedOrders: mockReorderSavedOrders,
    })
    render(<AddOrder {...defaultProps} />)
    expect(screen.getByText('Eve')).toBeInTheDocument()
  })

  it('shows Saved Orders section title', () => {
    render(<AddOrder {...defaultProps} />)
    expect(screen.getByText('Saved Orders')).toBeInTheDocument()
  })

  it('wires onUsual to Saved Order cards', () => {
    const onUsual = vi.fn()
    const saved = [createSavedOrder({ id: 's1' })]
    mockUseSavedOrderContext.mockReturnValue({
      savedOrders: saved,
      removeSavedOrder: mockRemoveSavedOrder,
      reorderSavedOrders: mockReorderSavedOrders,
    })
    render(<AddOrder {...defaultProps} onUsual={onUsual} />)
    fireEvent.click(screen.getByRole('button', { name: 'Use' }))
    expect(onUsual).toHaveBeenCalledWith(saved[0])
  })

  it('wires onCustom to Saved Order cards', () => {
    const onCustom = vi.fn()
    const saved = [createSavedOrder({ id: 's1' })]
    mockUseSavedOrderContext.mockReturnValue({
      savedOrders: saved,
      removeSavedOrder: mockRemoveSavedOrder,
      reorderSavedOrders: mockReorderSavedOrders,
    })
    render(<AddOrder {...defaultProps} onCustom={onCustom} />)
    fireEvent.click(screen.getByRole('button', { name: 'Customised' }))
    expect(onCustom).toHaveBeenCalledWith(saved[0])
  })

  describe('delete saved order', () => {
    const saved = [createSavedOrder({ id: 's1' })]

    beforeEach(() => {
      mockUseSavedOrderContext.mockReturnValue({
        savedOrders: saved,
        removeSavedOrder: mockRemoveSavedOrder,
        reorderSavedOrders: mockReorderSavedOrders,
      })
    })

    it('shows confirm dialog when delete button is clicked', () => {
      render(<AddOrder {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
      expect(screen.getByText('Delete Saved Order?')).toBeInTheDocument()
    })

    it('calls removeSavedOrder and closes dialog when Remove is confirmed', () => {
      render(<AddOrder {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
      fireEvent.click(screen.getByText('Remove'))
      expect(mockRemoveSavedOrder).toHaveBeenCalledWith('s1')
      expect(screen.queryByText('Delete Saved Order?')).not.toBeInTheDocument()
    })

    it('does not call removeSavedOrder and closes dialog when cancelled', () => {
      render(<AddOrder {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
      fireEvent.click(screen.getByText('Never mind'))
      expect(mockRemoveSavedOrder).not.toHaveBeenCalled()
      expect(screen.queryByText('Delete Saved Order?')).not.toBeInTheDocument()
    })
  })
})
