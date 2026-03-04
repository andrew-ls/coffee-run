import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DragHandle } from './DragHandle'

describe('DragHandle', () => {
  it('renders with role button', () => {
    render(<DragHandle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('has the i18n aria-label', () => {
    render(<DragHandle />)
    expect(screen.getByRole('button', { name: 'Drag to reorder' })).toBeInTheDocument()
  })

  it('renders the SVG icon', () => {
    const { container } = render(<DragHandle />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<DragHandle data-testid="drag-handle" />)
    expect(screen.getByTestId('drag-handle')).toBeInTheDocument()
  })
})
