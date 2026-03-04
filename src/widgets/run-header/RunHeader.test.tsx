import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RunHeader } from './RunHeader'

const mockUseRunContext = vi.fn()
const mockUseActiveOrderContext = vi.fn()

vi.mock('@/app/contexts/RunContext', () => ({
  useRunContext: () => mockUseRunContext(),
}))

vi.mock('@/app/contexts/ActiveOrderContext', () => ({
  useActiveOrderContext: () => mockUseActiveOrderContext(),
}))

describe('RunHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRunContext.mockReturnValue({ activeRun: null })
    mockUseActiveOrderContext.mockReturnValue({ orders: [] })
  })

  it('renders the app name', () => {
    render(<RunHeader />)
    expect(screen.getByText('Coffee Run')).toBeInTheDocument()
  })

  it('shows no-Run message when hasActiveRun is false', () => {
    render(<RunHeader />)
    expect(screen.getByText(/No Run on/)).toBeInTheDocument()
  })

  it('shows round in progress message when hasActiveRun is true', () => {
    mockUseRunContext.mockReturnValue({ activeRun: { id: 'run-1', startedAt: 0 } })
    mockUseActiveOrderContext.mockReturnValue({ orders: [{ id: 'o1' }, { id: 'o2' }] })
    render(<RunHeader />)
    expect(screen.getByText(/Run in progress/)).toBeInTheDocument()
  })

  it('shows singular Order count', () => {
    mockUseRunContext.mockReturnValue({ activeRun: { id: 'run-1', startedAt: 0 } })
    mockUseActiveOrderContext.mockReturnValue({ orders: [{ id: 'o1' }] })
    render(<RunHeader />)
    expect(screen.getByText(/1 Order/)).toBeInTheDocument()
  })

  it('shows plural Order count', () => {
    mockUseRunContext.mockReturnValue({ activeRun: { id: 'run-1', startedAt: 0 } })
    mockUseActiveOrderContext.mockReturnValue({ orders: [{ id: 'o1' }, { id: 'o2' }, { id: 'o3' }] })
    render(<RunHeader />)
    expect(screen.getByText(/3 Orders/)).toBeInTheDocument()
  })

  it('shows zero Order count', () => {
    mockUseRunContext.mockReturnValue({ activeRun: { id: 'run-1', startedAt: 0 } })
    mockUseActiveOrderContext.mockReturnValue({ orders: [] })
    render(<RunHeader />)
    expect(screen.getByText(/0 Orders/)).toBeInTheDocument()
  })

  it('renders help button when onHelpClick is provided', () => {
    render(<RunHeader onHelpClick={() => {}} />)
    expect(screen.getByRole('button', { name: /how to use/i })).toBeInTheDocument()
  })

  it('does not render help button when onHelpClick is not provided', () => {
    render(<RunHeader />)
    expect(screen.queryByRole('button', { name: /how to use/i })).not.toBeInTheDocument()
  })

  it('calls onHelpClick when help button is clicked', async () => {
    const user = userEvent.setup()
    const onHelpClick = vi.fn()
    render(<RunHeader onHelpClick={onHelpClick} />)
    await user.click(screen.getByRole('button', { name: /how to use/i }))
    expect(onHelpClick).toHaveBeenCalledOnce()
  })
})
