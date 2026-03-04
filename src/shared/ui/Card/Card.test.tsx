import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card><span>Hello</span></Card>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('applies the base card class', () => {
    const { container } = render(<Card>content</Card>)
    expect(container.querySelector('.card')).toBeInTheDocument()
  })

  it('applies additional className when provided', () => {
    const { container } = render(<Card className="custom">content</Card>)
    const el = container.firstChild as HTMLElement
    expect(el.classList.contains('custom')).toBe(true)
  })
})
