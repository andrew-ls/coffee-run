import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ActiveOrderCard } from './ActiveOrderCard'
import { createActiveOrder } from '@/test/fixtures'

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
}))

const defaultProps = {
  order: createActiveOrder({ personName: 'Alice', drinkType: 'Coffee', variant: 'Latte' }),
  onToggleDone: vi.fn(),
  onEdit: vi.fn(),
  onRemove: vi.fn(),
}

describe('ActiveOrderCard', () => {
  it('renders the person name', () => {
    render(<ActiveOrderCard {...defaultProps} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders drink pills', () => {
    render(<ActiveOrderCard {...defaultProps} />)
    expect(screen.getByText('Coffee')).toBeInTheDocument()
    expect(screen.getByText('Latte')).toBeInTheDocument()
  })

  describe('when not done', () => {
    it('renders Mark as done, Edit Order, and Remove Order buttons', () => {
      render(<ActiveOrderCard {...defaultProps} />)
      expect(screen.getByRole('button', { name: 'Mark as done' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Edit Order' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Remove Order' })).toBeInTheDocument()
    })

    it('calls onToggleDone when Mark as done is clicked', () => {
      const onToggleDone = vi.fn()
      render(<ActiveOrderCard {...defaultProps} onToggleDone={onToggleDone} />)
      fireEvent.click(screen.getByRole('button', { name: 'Mark as done' }))
      expect(onToggleDone).toHaveBeenCalledOnce()
    })

    it('calls onEdit when Edit Order is clicked', () => {
      const onEdit = vi.fn()
      render(<ActiveOrderCard {...defaultProps} onEdit={onEdit} />)
      fireEvent.click(screen.getByRole('button', { name: 'Edit Order' }))
      expect(onEdit).toHaveBeenCalledOnce()
    })

    it('calls onRemove when Remove Order is clicked', () => {
      const onRemove = vi.fn()
      render(<ActiveOrderCard {...defaultProps} onRemove={onRemove} />)
      fireEvent.click(screen.getByRole('button', { name: 'Remove Order' }))
      expect(onRemove).toHaveBeenCalledOnce()
    })
  })

  describe('when done', () => {
    const doneOrder = createActiveOrder({ personName: 'Alice', done: true })

    it('renders only Undo button', () => {
      render(<ActiveOrderCard {...defaultProps} order={doneOrder} />)
      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Mark as done' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Remove Order' })).not.toBeInTheDocument()
    })

    it('calls onToggleDone when Undo is clicked', () => {
      const onToggleDone = vi.fn()
      render(<ActiveOrderCard {...defaultProps} order={doneOrder} onToggleDone={onToggleDone} />)
      fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
      expect(onToggleDone).toHaveBeenCalledOnce()
    })
  })
})
