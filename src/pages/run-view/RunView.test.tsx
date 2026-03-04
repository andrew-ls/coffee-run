import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RunView } from './RunView'
import { createOrder } from '@/test/fixtures'

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

const mockRemoveOrder = vi.fn()
const mockToggleDone = vi.fn()
const mockReorderOrders = vi.fn()
const mockUseRunContext = vi.fn()
const mockUseActiveOrderContext = vi.fn()

vi.mock('@/app/contexts/RunContext', () => ({
  useRunContext: () => mockUseRunContext(),
}))

vi.mock('@/app/contexts/ActiveOrderContext', () => ({
  useActiveOrderContext: () => mockUseActiveOrderContext(),
}))

const defaultProps = {
  onStartRun: vi.fn(),
  onEditOrder: vi.fn(),
}

describe('RunView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRunContext.mockReturnValue({ activeRun: null })
    mockUseActiveOrderContext.mockReturnValue({
      orders: [],
      toggleDone: mockToggleDone,
      removeOrder: mockRemoveOrder,
      reorderOrders: mockReorderOrders,
    })
  })

  describe('no active run', () => {
    it('shows the start run button', () => {
      render(<RunView {...defaultProps} />)
      expect(screen.getByText('Start a new Run')).toBeInTheDocument()
    })

    it('calls onStartRun when start button is clicked', () => {
      const onStartRun = vi.fn()
      render(<RunView onStartRun={onStartRun} onEditOrder={vi.fn()} />)
      fireEvent.click(screen.getByText('Start a new Run'))
      expect(onStartRun).toHaveBeenCalledOnce()
    })
  })

  describe('active Run with Orders', () => {
    const orders = [
      createOrder({ id: 'o1', personName: 'Alice' }),
      createOrder({ id: 'o2', personName: 'Bob' }),
    ]

    it('renders Order cards', () => {
      mockUseRunContext.mockReturnValue({ activeRun: { id: 'run-1', startedAt: 0 } })
      mockUseActiveOrderContext.mockReturnValue({
        orders,
        toggleDone: mockToggleDone,
        removeOrder: mockRemoveOrder,
        reorderOrders: mockReorderOrders,
      })
      render(<RunView {...defaultProps} />)
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  describe('delete Order dialog', () => {
    const orders = [createOrder({ id: 'o1', personName: 'Alice' })]

    beforeEach(() => {
      mockUseRunContext.mockReturnValue({ activeRun: { id: 'run-1', startedAt: 0 } })
      mockUseActiveOrderContext.mockReturnValue({
        orders,
        toggleDone: mockToggleDone,
        removeOrder: mockRemoveOrder,
        reorderOrders: mockReorderOrders,
      })
    })

    it('opens delete confirm dialog when delete is triggered', () => {
      render(<RunView {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: 'Remove Order' }))
      expect(screen.getByText('Remove this Order?')).toBeInTheDocument()
    })

    it('calls removeOrder with the correct id when confirmed', () => {
      render(<RunView {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: 'Remove Order' }))
      fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
      expect(mockRemoveOrder).toHaveBeenCalledWith('o1')
    })

    it('closes dialog without deleting when cancelled', () => {
      render(<RunView {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: 'Remove Order' }))
      fireEvent.click(screen.getByText('Never mind'))
      expect(screen.queryByText('Remove this Order?')).not.toBeInTheDocument()
      expect(mockRemoveOrder).not.toHaveBeenCalled()
    })
  })
})
