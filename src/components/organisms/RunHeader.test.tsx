import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RunHeader } from './RunHeader'

describe('RunHeader', () => {
  it('renders the app name', () => {
    render(<RunHeader orderCount={0} hasActiveRun={false} />)
    expect(screen.getByText('Coffee Run')).toBeInTheDocument()
  })

  it('shows no-Run message when hasActiveRun is false', () => {
    render(<RunHeader orderCount={0} hasActiveRun={false} />)
    expect(screen.getByText(/No Run on/)).toBeInTheDocument()
  })

  it('shows round in progress message when hasActiveRun is true', () => {
    render(<RunHeader orderCount={2} hasActiveRun={true} />)
    expect(screen.getByText(/Run in progress/)).toBeInTheDocument()
  })

  it('shows singular Order count', () => {
    render(<RunHeader orderCount={1} hasActiveRun={true} />)
    expect(screen.getByText(/1 Order/)).toBeInTheDocument()
  })

  it('shows plural Order count', () => {
    render(<RunHeader orderCount={3} hasActiveRun={true} />)
    expect(screen.getByText(/3 Orders/)).toBeInTheDocument()
  })

  it('shows zero Order count', () => {
    render(<RunHeader orderCount={0} hasActiveRun={true} />)
    expect(screen.getByText(/0 Orders/)).toBeInTheDocument()
  })
})
