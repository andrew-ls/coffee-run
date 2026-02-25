import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RunHeader } from './RunHeader'

describe('RunHeader', () => {
  it('renders the app name', () => {
    render(<RunHeader orderCount={0} hasActiveRun={false} />)
    expect(screen.getByText('Coffee Run')).toBeInTheDocument()
  })

  it('shows no-run message when hasActiveRun is false', () => {
    render(<RunHeader orderCount={0} hasActiveRun={false} />)
    expect(screen.getByText(/No run on/)).toBeInTheDocument()
  })

  it('shows round in progress message when hasActiveRun is true', () => {
    render(<RunHeader orderCount={2} hasActiveRun={true} />)
    expect(screen.getByText(/Brew round in progress/)).toBeInTheDocument()
  })

  it('shows singular order count', () => {
    render(<RunHeader orderCount={1} hasActiveRun={true} />)
    expect(screen.getByText(/1 order/)).toBeInTheDocument()
  })

  it('shows plural order count', () => {
    render(<RunHeader orderCount={3} hasActiveRun={true} />)
    expect(screen.getByText(/3 orders/)).toBeInTheDocument()
  })

  it('shows zero order count', () => {
    render(<RunHeader orderCount={0} hasActiveRun={true} />)
    expect(screen.getByText(/0 orders/)).toBeInTheDocument()
  })
})
