import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

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

  it('applies coffee class for Coffee', () => {
    const { container } = render(<Badge drinkType="Coffee" />)
    expect(container.querySelector('span')?.className).toContain('coffee')
  })

  it('applies tea class for Tea', () => {
    const { container } = render(<Badge drinkType="Tea" />)
    expect(container.querySelector('span')?.className).toContain('tea')
  })

  it('applies other class for unknown drink types', () => {
    const { container } = render(<Badge drinkType="Unknown" />)
    expect(container.querySelector('span')?.className).toContain('other')
  })
})
