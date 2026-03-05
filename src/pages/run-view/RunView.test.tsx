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
  arrayMove: vi.fn(),
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
})
)

const activeRun = { id: 'run-1', userId: 'default-user', createdAt: '2024-01-15T12:00:00.000Z', archivedAt: null }

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

  describe('active run with no Orders', () => {
    beforeEach(() => {
      mockUseRunContext.mockReturnValue({ activeRun })
      mockUseActiveOrderContext.mockReturnValue({
        orders: [],
        toggleDone: mockToggleDone,
        removeOrder: mockRemoveOrder,
        reorderOrders: mockReorderOrders,
      })
    })

    it('shows the empty state mascot without an order list', () => {
      render(<RunView {...defaultProps} />)
      expect(screen.queryByRole('button', { name: 'Remove Order' })).not.toBeInTheDocument()
    })

    it('does not show the start run button', () => {
      render(<RunView {...defaultProps} />)
      expect(screen.queryByText('Start a new Run')).not.toBeInTheDocument()
    })
  })

  describe('active run with Orders', () => {
    const orders = [
      createOrder({ id: 'o1', personName: 'Alice' }),
      createOrder({ id: 'o2', personName: 'Bob' }),
    ]

    beforeEach(() => {
      mockUseRunContext.mockReturnValue({ activeRun })
      mockUseActiveOrderContext.mockReturnValue({
        orders,
        toggleDone: mockToggleDone,
        removeOrder: mockRemoveOrder,
        reorderOrders: mockReorderOrders,
      })
    })

    it('renders Order cards', () => {
      render(<RunView {...defaultProps} />)
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })

    it('calls toggleDone with the order id when Done is clicked', () => {
      render(<RunView {...defaultProps} />)
      fireEvent.click(screen.getAllByRole('button', { name: 'Mark as done' })[0])
      expect(mockToggleDone).toHaveBeenCalledWith('o1')
    })

    it('calls onEditOrder with the order id when Edit is clicked', () => {
      const onEditOrder = vi.fn()
      render(<RunView onStartRun={vi.fn()} onEditOrder={onEditOrder} />)
      fireEvent.click(screen.getAllByRole('button', { name: 'Edit Order' })[0])
      expect(onEditOrder).toHaveBeenCalledWith('o1')
    })
  })

  describe('delete Order dialog', () => {
    const orders = [createOrder({ id: 'o1', personName: 'Alice' })]

    beforeEach(() => {
      mockUseRunContext.mockReturnValue({ activeRun })
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
