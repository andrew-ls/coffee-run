import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('renders help button when onHelpClick is provided', () => {
    render(<RunHeader orderCount={0} hasActiveRun={false} onHelpClick={() => {}} />)
    expect(screen.getByRole('button', { name: /how to use/i })).toBeInTheDocument()
  })

  it('does not render help button when onHelpClick is not provided', () => {
    render(<RunHeader orderCount={0} hasActiveRun={false} />)
    expect(screen.queryByRole('button', { name: /how to use/i })).not.toBeInTheDocument()
  })

  it('calls onHelpClick when help button is clicked', async () => {
    const user = userEvent.setup()
    const onHelpClick = vi.fn()
    render(<RunHeader orderCount={0} hasActiveRun={false} onHelpClick={onHelpClick} />)
    await user.click(screen.getByRole('button', { name: /how to use/i }))
    expect(onHelpClick).toHaveBeenCalledOnce()
  })
})
