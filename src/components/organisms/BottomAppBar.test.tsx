import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BottomAppBar, Fab } from './BottomAppBar'
import React from 'react'

describe('BottomAppBar', () => {
  it('renders left slot content', () => {
    render(<BottomAppBar left={<button>End Run</button>} />)
    expect(screen.getByText('End Run')).toBeInTheDocument()
  })

  it('renders right slot content', () => {
    render(<BottomAppBar right={<button>Add Order</button>} />)
    expect(screen.getByText('Add Order')).toBeInTheDocument()
  })

  it('applies sidebarOffset class when sidebarOffset prop is true', () => {
    const { container } = render(<BottomAppBar sidebarOffset />)
    expect(container.firstChild).toHaveClass('sidebarOffset')
  })

  it('does not apply sidebarOffset class by default', () => {
    const { container } = render(<BottomAppBar />)
    expect(container.firstChild).not.toHaveClass('sidebarOffset')
  })
})

describe('Fab', () => {
  it('renders with correct aria-label', () => {
    render(<Fab onClick={vi.fn()} label="Add Order" />)
    expect(screen.getByRole('button', { name: 'Add Order' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Fab onClick={onClick} label="Add Order" />)
    fireEvent.click(screen.getByRole('button', { name: 'Add Order' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
