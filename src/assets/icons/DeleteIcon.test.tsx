import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DeleteIcon } from './DeleteIcon'

describe('DeleteIcon', () => {
  it('renders an svg element', () => {
    const { container } = render(<DeleteIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies default width and height', () => {
    const { container } = render(<DeleteIcon />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '16')
    expect(svg).toHaveAttribute('height', '16')
  })

  it('accepts custom width and height', () => {
    const { container } = render(<DeleteIcon width={24} height={24} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('forwards additional svg props', () => {
    const { container } = render(<DeleteIcon className="extra" />)
    expect(container.querySelector('svg')).toHaveAttribute('class', 'extra')
  })
})
