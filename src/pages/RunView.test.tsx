import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RunView } from './RunView'
import { createOrder } from '@/test/fixtures'

vi.mock('@/hooks/useBreakpoint', () => ({
  useBreakpoint: vi.fn().mockReturnValue('desktop'),
}))

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

import React from 'react'

const defaultProps = {
  hasActiveRun: false,
  orders: [],
  onStartRun: vi.fn(),
  onEndRun: vi.fn(),
  onAddOrder: vi.fn(),
  onEditOrder: vi.fn(),
  onDeleteOrder: vi.fn(),
  onReorderOrder: vi.fn(),
}

describe('RunView', () => {
  describe('no active run', () => {
    it('shows the start run button', () => {
      render(<RunView {...defaultProps} hasActiveRun={false} />)
      expect(screen.getByText('Start a new Run')).toBeInTheDocument()
    })

    it('calls onStartRun when start button is clicked', () => {
      const onStartRun = vi.fn()
      render(<RunView {...defaultProps} hasActiveRun={false} onStartRun={onStartRun} />)
      fireEvent.click(screen.getByText('Start a new Run'))
      expect(onStartRun).toHaveBeenCalledOnce()
    })

    it('shows header when showHeader is true (default)', () => {
      render(<RunView {...defaultProps} hasActiveRun={false} />)
      expect(screen.getByText('Coffee Run')).toBeInTheDocument()
    })

    it('hides header when showHeader is false', () => {
      render(<RunView {...defaultProps} hasActiveRun={false} showHeader={false} />)
      expect(screen.queryByText('Coffee Run')).not.toBeInTheDocument()
    })
  })

  describe('active Run, no Orders', () => {
    it('shows End Run button', () => {
      render(<RunView {...defaultProps} hasActiveRun={true} orders={[]} />)
      expect(screen.getByText('End Run')).toBeInTheDocument()
    })

    it('shows FAB when showAddButton is true (default)', () => {
      render(<RunView {...defaultProps} hasActiveRun={true} orders={[]} />)
      expect(screen.getByRole('button', { name: 'Add Order' })).toBeInTheDocument()
    })

    it('hides FAB when showAddButton is false', () => {
      render(<RunView {...defaultProps} hasActiveRun={true} orders={[]} showAddButton={false} />)
      expect(screen.queryByRole('button', { name: 'Add Order' })).not.toBeInTheDocument()
    })

    it('calls onAddOrder when FAB is clicked', () => {
      const onAddOrder = vi.fn()
      render(<RunView {...defaultProps} hasActiveRun={true} orders={[]} onAddOrder={onAddOrder} />)
      fireEvent.click(screen.getByRole('button', { name: 'Add Order' }))
      expect(onAddOrder).toHaveBeenCalledOnce()
    })
  })

  describe('active Run with Orders', () => {
    const orders = [
      createOrder({ id: 'o1', personName: 'Alice' }),
      createOrder({ id: 'o2', personName: 'Bob' }),
    ]

    it('renders Order cards', () => {
      render(<RunView {...defaultProps} hasActiveRun={true} orders={orders} />)
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  describe('end run dialog', () => {
    it('opens end run confirm dialog when End Run is clicked', () => {
      render(<RunView {...defaultProps} hasActiveRun={true} />)
      fireEvent.click(screen.getByText('End Run'))
      expect(screen.getByText('End this round?')).toBeInTheDocument()
    })

    it('calls onEndRun when confirm is clicked', () => {
      const onEndRun = vi.fn()
      render(<RunView {...defaultProps} hasActiveRun={true} onEndRun={onEndRun} />)
      fireEvent.click(screen.getByText('End Run'))
      fireEvent.click(screen.getByText('End round'))
      expect(onEndRun).toHaveBeenCalledOnce()
    })

    it('closes dialog when cancel is clicked', () => {
      render(<RunView {...defaultProps} hasActiveRun={true} />)
      fireEvent.click(screen.getByText('End Run'))
      fireEvent.click(screen.getByText('Never mind'))
      expect(screen.queryByText('End this round?')).not.toBeInTheDocument()
    })
  })

  describe('delete Order dialog', () => {
    const orders = [createOrder({ id: 'o1', personName: 'Alice' })]

    it('opens delete confirm dialog when delete is triggered', () => {
      render(<RunView {...defaultProps} hasActiveRun={true} orders={orders} />)
      // Click delete button on the Order card
      fireEvent.click(screen.getByRole('button', { name: 'Delete Order' }))
      expect(screen.getByText('Remove this Order?')).toBeInTheDocument()
    })

    it('calls onDeleteOrder with the correct id when confirmed', () => {
      const onDeleteOrder = vi.fn()
      render(
        <RunView {...defaultProps} hasActiveRun={true} orders={orders} onDeleteOrder={onDeleteOrder} />,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Delete Order' }))
      fireEvent.click(screen.getByText('Remove'))
      expect(onDeleteOrder).toHaveBeenCalledWith('o1')
    })

    it('closes dialog without deleting when cancelled', () => {
      const onDeleteOrder = vi.fn()
      render(
        <RunView {...defaultProps} hasActiveRun={true} orders={orders} onDeleteOrder={onDeleteOrder} />,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Delete Order' }))
      fireEvent.click(screen.getByText('Never mind'))
      expect(screen.queryByText('Remove this Order?')).not.toBeInTheDocument()
      expect(onDeleteOrder).not.toHaveBeenCalled()
    })
  })
})
