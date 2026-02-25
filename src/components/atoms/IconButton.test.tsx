import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('renders a button', () => {
    render(<IconButton label="Close">×</IconButton>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('sets aria-label from label prop', () => {
    render(<IconButton label="Delete item">🗑</IconButton>)
    expect(screen.getByRole('button', { name: 'Delete item' })).toBeInTheDocument()
  })

  it('sets title from label prop', () => {
    render(<IconButton label="Edit">✎</IconButton>)
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Edit')
  })

  it('renders children', () => {
    render(<IconButton label="X">content</IconButton>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('fires onClick when clicked', () => {
    const onClick = vi.fn()
    render(
      <IconButton label="Click me" onClick={onClick}>
        •
      </IconButton>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies danger class when variant is danger', () => {
    render(
      <IconButton label="Delete" variant="danger">
        x
      </IconButton>,
    )
    expect(screen.getByRole('button').className).toContain('danger')
  })

  it('does not apply danger class for default variant', () => {
    render(<IconButton label="Default">x</IconButton>)
    expect(screen.getByRole('button').className).not.toContain('danger')
  })

  it('forwards disabled prop', () => {
    render(
      <IconButton label="Disabled" disabled>
        x
      </IconButton>,
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
