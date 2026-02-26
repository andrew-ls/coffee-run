import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrderFormPage } from './OrderFormPage'

describe('OrderFormPage', () => {
  it('shows "New Order" title when no orderId', () => {
    render(<OrderFormPage onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('New Order')).toBeInTheDocument()
  })

  it('shows "Edit Order" title when orderId is provided', () => {
    render(<OrderFormPage orderId="some-id" onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Edit Order')).toBeInTheDocument()
  })

  it('uses "Add Order" submit label for new Orders', () => {
    render(<OrderFormPage onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Add Order' })).toBeInTheDocument()
  })

  it('uses "Update Order" submit label when editing', () => {
    render(<OrderFormPage orderId="some-id" onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Update Order' })).toBeInTheDocument()
  })

  it('pre-fills form with initialData', () => {
    render(
      <OrderFormPage
        initialData={{ personName: 'Dan', drinkType: 'Coffee' }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByPlaceholderText('Name')).toHaveValue('Dan')
  })

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<OrderFormPage onSubmit={vi.fn()} onCancel={onCancel} />)
    screen.getByRole('button', { name: /cancel/i }).click()
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
