import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Fab } from './Fab'

describe('Fab', () => {
  it('renders a button with the given aria-label', () => {
    render(<Fab onClick={vi.fn()} label="Add Order" />)
    expect(screen.getByRole('button', { name: 'Add Order' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Fab onClick={onClick} label="Add Order" />)
    fireEvent.click(screen.getByRole('button', { name: 'Add Order' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when not clicked', () => {
    const onClick = vi.fn()
    render(<Fab onClick={onClick} label="Add Order" />)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders + as its visible content', () => {
    render(<Fab onClick={vi.fn()} label="Add Order" />)
    expect(screen.getByRole('button', { name: 'Add Order' })).toHaveTextContent('+')
  })
})
