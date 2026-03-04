import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LandingPage } from './LandingPage'

describe('LandingPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<LandingPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the page title', () => {
    render(<LandingPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('How it works')
  })

  it('renders all three step titles', () => {
    render(<LandingPage />)
    expect(screen.getByText('Start a Run')).toBeInTheDocument()
    expect(screen.getByText('Add Orders')).toBeInTheDocument()
    expect(screen.getByText('Finish up')).toBeInTheDocument()
  })

  it('renders step descriptions', () => {
    render(<LandingPage />)
    expect(screen.getByText(/Tap "Start a new Run" to get going/)).toBeInTheDocument()
    expect(screen.getByText(/Use the \+ button/)).toBeInTheDocument()
    expect(screen.getByText(/tap "End Run" to wrap up/)).toBeInTheDocument()
  })

  it('renders step numbers', () => {
    render(<LandingPage />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<LandingPage />)
    expect(screen.getByText('Good to know')).toBeInTheDocument()
    expect(screen.getByText(/Remember this one/)).toBeInTheDocument()
    expect(screen.getByText(/Swipe an order card/)).toBeInTheDocument()
    expect(screen.getByText(/Hold and drag/)).toBeInTheDocument()
  })

  it('renders SVG illustrations', () => {
    const { container } = render(<LandingPage />)
    const svgs = container.querySelectorAll('svg')
    // 4 SVGs: desktop arrow + 3 step illustrations
    expect(svgs.length).toBe(4)
  })

  it('marks illustrations as decorative', () => {
    const { container } = render(<LandingPage />)
    const svgs = container.querySelectorAll('svg[aria-hidden="true"]')
    expect(svgs.length).toBe(4)
  })
})
