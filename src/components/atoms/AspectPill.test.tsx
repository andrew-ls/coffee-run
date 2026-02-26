import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AspectPill } from './AspectPill'
import { ASPECT_COLORS } from '@/config'

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

describe('AspectPill', () => {
  it('renders the label as text', () => {
    render(<AspectPill category="iced" label="Iced" />)
    expect(screen.getByText('Iced')).toBeInTheDocument()
  })

  it('renders a span element', () => {
    const { container } = render(<AspectPill category="variant" label="Americano" />)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  it('applies correct colors for iced category', () => {
    const { container } = render(<AspectPill category="iced" label="Iced" />)
    const span = container.querySelector('span')!
    expect(span.style.backgroundColor).toBe(hexToRgb(ASPECT_COLORS.iced.background))
    expect(span.style.color).toBe(hexToRgb(ASPECT_COLORS.iced.text))
  })

  it('applies correct colors for variant category', () => {
    const { container } = render(<AspectPill category="variant" label="Latte" />)
    const span = container.querySelector('span')!
    expect(span.style.backgroundColor).toBe(hexToRgb(ASPECT_COLORS.variant.background))
    expect(span.style.color).toBe(hexToRgb(ASPECT_COLORS.variant.text))
  })

  it('applies correct colors for milk category', () => {
    const { container } = render(<AspectPill category="milk" label="Splash Oat milk" />)
    const span = container.querySelector('span')!
    expect(span.style.backgroundColor).toBe(hexToRgb(ASPECT_COLORS.milk.background))
    expect(span.style.color).toBe(hexToRgb(ASPECT_COLORS.milk.text))
  })

  it('applies correct colors for sweetener category', () => {
    const { container } = render(<AspectPill category="sweetener" label="2 Sugar" />)
    const span = container.querySelector('span')!
    expect(span.style.backgroundColor).toBe(hexToRgb(ASPECT_COLORS.sweetener.background))
    expect(span.style.color).toBe(hexToRgb(ASPECT_COLORS.sweetener.text))
  })

  it('applies optional className', () => {
    const { container } = render(<AspectPill category="iced" label="Iced" className="custom" />)
    expect(container.querySelector('span')?.className).toContain('custom')
  })
})
