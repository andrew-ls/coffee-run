import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DragHandleIcon } from './DragHandleIcon'

describe('DragHandleIcon', () => {
  it('renders an svg element', () => {
    const { container } = render(<DragHandleIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies default width and height', () => {
    const { container } = render(<DragHandleIcon />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '14')
    expect(svg).toHaveAttribute('height', '20')
  })

  it('accepts custom width and height', () => {
    const { container } = render(<DragHandleIcon width={28} height={40} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '28')
    expect(svg).toHaveAttribute('height', '40')
  })

  it('renders with fill currentColor', () => {
    const { container } = render(<DragHandleIcon />)
    expect(container.querySelector('svg')).toHaveAttribute('fill', 'currentColor')
  })

  it('forwards additional svg props', () => {
    const { container } = render(<DragHandleIcon className="extra" />)
    expect(container.querySelector('svg')).toHaveAttribute('class', 'extra')
  })
})
