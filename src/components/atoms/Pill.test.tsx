import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pill } from './Pill'

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

describe('Pill', () => {
  const color = { background: '#E3F2FD', text: '#1565C0' }

  it('renders the label as text', () => {
    render(<Pill label="Iced" color={color} />)
    expect(screen.getByText('Iced')).toBeInTheDocument()
  })

  it('renders a span element', () => {
    const { container } = render(<Pill label="Latte" color={color} />)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  it('applies background color from props', () => {
    const { container } = render(<Pill label="Test" color={color} />)
    const span = container.querySelector('span')!
    expect(span.style.backgroundColor).toBe(hexToRgb(color.background))
  })

  it('applies text color from props', () => {
    const { container } = render(<Pill label="Test" color={color} />)
    const span = container.querySelector('span')!
    expect(span.style.color).toBe(hexToRgb(color.text))
  })

  it('applies optional className', () => {
    const { container } = render(<Pill label="Test" color={color} className="extra" />)
    expect(container.querySelector('span')?.className).toContain('extra')
  })

  it('does not add undefined to className when none is provided', () => {
    const { container } = render(<Pill label="Test" color={color} />)
    const span = container.querySelector('span')!
    expect(span.className).not.toContain('undefined')
  })
})
