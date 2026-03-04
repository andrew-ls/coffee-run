import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CheckIcon } from './CheckIcon'

describe('CheckIcon', () => {
  it('renders an svg element', () => {
    const { container } = render(<CheckIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies default width and height', () => {
    const { container } = render(<CheckIcon />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '16')
    expect(svg).toHaveAttribute('height', '16')
  })

  it('accepts custom width and height', () => {
    const { container } = render(<CheckIcon width={24} height={24} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('forwards additional svg props', () => {
    const { container } = render(<CheckIcon className="extra" />)
    expect(container.querySelector('svg')).toHaveAttribute('class', 'extra')
  })
})
