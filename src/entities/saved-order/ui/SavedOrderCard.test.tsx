import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SavedOrderCard } from './SavedOrderCard'
import { createSavedOrder, createOrderFormData } from '@/test/fixtures'

const defaultProps = {
  savedOrder: createSavedOrder({
    orderData: createOrderFormData({ personName: 'Alice', drinkType: 'Coffee', variant: 'Latte' }),
  }),
  onAdd: vi.fn(),
  onCustomised: vi.fn(),
  onDelete: vi.fn(),
}

describe('SavedOrderCard', () => {
  it('renders the person name', () => {
    render(<SavedOrderCard {...defaultProps} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders drink pills', () => {
    render(<SavedOrderCard {...defaultProps} />)
    expect(screen.getByText('Coffee')).toBeInTheDocument()
    expect(screen.getByText('Latte')).toBeInTheDocument()
  })

  it('renders Use, Customised, and Delete buttons', () => {
    render(<SavedOrderCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Use' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Customised' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onAdd when Use is clicked', () => {
    const onAdd = vi.fn()
    render(<SavedOrderCard {...defaultProps} onAdd={onAdd} />)
    fireEvent.click(screen.getByRole('button', { name: 'Use' }))
    expect(onAdd).toHaveBeenCalledOnce()
  })

  it('calls onCustomised when Customised is clicked', () => {
    const onCustomised = vi.fn()
    render(<SavedOrderCard {...defaultProps} onCustomised={onCustomised} />)
    fireEvent.click(screen.getByRole('button', { name: 'Customised' }))
    expect(onCustomised).toHaveBeenCalledOnce()
  })

  it('calls onDelete when Delete is clicked', () => {
    const onDelete = vi.fn()
    render(<SavedOrderCard {...defaultProps} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledOnce()
  })
})
