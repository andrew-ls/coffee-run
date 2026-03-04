import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDialog } from './ConfirmDialog'

const defaultProps = {
  title: 'Are you sure?',
  message: 'This cannot be undone.',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
}

describe('ConfirmDialog', () => {
  it('renders the title', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('renders the message', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('renders Cancel and Confirm buttons', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByText('Never mind')).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
  })

  it('uses custom confirmLabel when provided', () => {
    render(<ConfirmDialog {...defaultProps} confirmLabel="Yes, delete it" />)
    expect(screen.getByText('Yes, delete it')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('Confirm'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Never mind'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('calls onCancel when overlay is clicked', () => {
    const onCancel = vi.fn()
    const { container } = render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)
    // Click the overlay (first child of container)
    const overlay = container.firstChild as HTMLElement
    fireEvent.click(overlay)
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('does not call onCancel when dialog box itself is clicked', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)
    // Click the title (inside the dialog box)
    fireEvent.click(screen.getByText('Are you sure?'))
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('applies danger variant to confirm button by default', () => {
    render(<ConfirmDialog {...defaultProps} />)
    const confirmBtn = screen.getByText('Confirm')
    expect(confirmBtn.className).toContain('danger')
  })

  it('applies primary variant when confirmVariant is primary', () => {
    render(<ConfirmDialog {...defaultProps} confirmVariant="primary" />)
    const confirmBtn = screen.getByText('Confirm')
    expect(confirmBtn.className).toContain('primary')
  })
})
