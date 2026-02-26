import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'
import { DRINKS } from '@/config'

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

describe('Badge', () => {
  it('renders the drink type as text', () => {
    render(<Badge drinkType="Coffee" />)
    expect(screen.getByText('Coffee')).toBeInTheDocument()
  })

  it('renders a span element', () => {
    const { container } = render(<Badge drinkType="Tea" />)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  it('renders each known drink type', () => {
    const types = ['Coffee', 'Tea', 'Hot Chocolate', 'Juice', 'Other']
    types.forEach((type) => {
      const { unmount } = render(<Badge drinkType={type} />)
      expect(screen.getByText(type)).toBeInTheDocument()
      unmount()
    })
  })

  it('renders unknown drink types without crashing', () => {
    render(<Badge drinkType="Bubble Tea" />)
    expect(screen.getByText('Bubble Tea')).toBeInTheDocument()
  })

  it('applies config-driven background color for Coffee', () => {
    const { container } = render(<Badge drinkType="Coffee" />)
    const span = container.querySelector('span')!
    const coffeeColor = DRINKS.find((d) => d.type === 'Coffee')!.pillColor
    expect(span.style.backgroundColor).toBe(hexToRgb(coffeeColor.background))
  })

  it('applies config-driven background color for Tea', () => {
    const { container } = render(<Badge drinkType="Tea" />)
    const span = container.querySelector('span')!
    const teaColor = DRINKS.find((d) => d.type === 'Tea')!.pillColor
    expect(span.style.backgroundColor).toBe(hexToRgb(teaColor.background))
  })

  it('applies config-driven background color for Hot Chocolate', () => {
    const { container } = render(<Badge drinkType="Hot Chocolate" />)
    const span = container.querySelector('span')!
    const color = DRINKS.find((d) => d.type === 'Hot Chocolate')!.pillColor
    expect(span.style.backgroundColor).toBe(hexToRgb(color.background))
  })

  it('applies config-driven background color for Juice', () => {
    const { container } = render(<Badge drinkType="Juice" />)
    const span = container.querySelector('span')!
    const color = DRINKS.find((d) => d.type === 'Juice')!.pillColor
    expect(span.style.backgroundColor).toBe(hexToRgb(color.background))
  })

  it('falls back to Other color for unknown drink types', () => {
    const { container } = render(<Badge drinkType="Unknown" />)
    const span = container.querySelector('span')!
    const fallbackColor = DRINKS.find((d) => d.type === 'Other')!.pillColor
    expect(span.style.backgroundColor).toBe(hexToRgb(fallbackColor.background))
  })

  it('applies optional className', () => {
    const { container } = render(<Badge drinkType="Coffee" className="extra" />)
    expect(container.querySelector('span')?.className).toContain('extra')
  })
})
