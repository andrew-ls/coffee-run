import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// Control breakpoint in each test
const mockUseBreakpoint = vi.fn().mockReturnValue('mobile')

vi.mock('@/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/hooks')>()
  return {
    ...actual,
    useBreakpoint: () => mockUseBreakpoint(),
  }
})

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => children,
  DragOverlay: () => null,
  PointerSensor: class {},
  TouchSensor: class {},
  closestCenter: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => children,
  useSortable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
  verticalListSortingStrategy: vi.fn(),
  arrayMove: (arr: unknown[], from: number, to: number) => {
    const r = [...arr]
    const [x] = r.splice(from, 1)
    r.splice(to, 0, x)
    return r
  },
}))

vi.mock('@dnd-kit/modifiers', () => ({ restrictToVerticalAxis: vi.fn() }))
vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: vi.fn(() => undefined) } },
}))

import React from 'react'

describe('App — mobile layout', () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue('mobile')
  })

  it('shows start Run screen with no active Run', () => {
    render(<App />)
    expect(screen.getByText('Start a new Run')).toBeInTheDocument()
  })

  it('starts a Run and shows the active Run view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByText('Start a new Run'))
    expect(screen.getByText('End Run')).toBeInTheDocument()
  })

  it('navigates to AddOrder when FAB is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    expect(screen.getByText('Add Order')).toBeInTheDocument()
    expect(screen.getByText('New Order')).toBeInTheDocument()
  })

  it('goes back from AddOrder to RunView', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByText('Back'))
    expect(screen.getByText('End Run')).toBeInTheDocument()
  })

  it('navigates to New Order form from AddOrder', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByText('New Order'))
    expect(screen.getByText('New Order')).toBeInTheDocument()
    // The form is shown — pick a drink placeholder confirms it
    expect(screen.getByText('Pick a drink...')).toBeInTheDocument()
  })

  it('submits a new Order and returns to RunView with the Order showing', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Start Run
    await user.click(screen.getByText('Start a new Run'))
    // Navigate to form
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByText('New Order'))

    // Fill form
    await user.type(screen.getByPlaceholderText('Name'), 'Alice')
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'Coffee')
    await user.click(screen.getByText('Add Order'))

    // Should be back in RunView with Alice's Order
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Pick a drink...')).not.toBeInTheDocument()
  })

  it('cancel from form navigates to AddOrder', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByText('New Order'))
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.getByText('Add Order')).toBeInTheDocument()
  })

  it('submitting with "Remember this one" saves to AddOrder screen', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByText('New Order'))

    await user.type(screen.getByPlaceholderText('Name'), 'Bob')
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'Tea')
    await user.click(screen.getByLabelText(/remember this one/i))
    await user.click(screen.getByText('Add Order'))

    // Navigate to AddOrder to see the Saved Order
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    expect(screen.getAllByText('Bob').length).toBeGreaterThan(0)
    // The Usual button should be there
    expect(screen.getByRole('button', { name: 'Usual' })).toBeInTheDocument()
  })

  it('clicking Usual adds the Saved Order and returns to Run view', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Save an Order
    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByText('New Order'))
    await user.type(screen.getByPlaceholderText('Name'), 'Eve')
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'Tea')
    await user.click(screen.getByLabelText(/remember this one/i))
    await user.click(screen.getByText('Add Order'))

    // Go to AddOrder to see the Saved Order
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByRole('button', { name: 'Usual' }))

    // Should be back at Run view with Eve's Order added again
    expect(screen.getByText('End Run')).toBeInTheDocument()
  })

  it('clicking Custom opens the form pre-filled from Saved Order', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Save an Order
    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByText('New Order'))
    await user.type(screen.getByPlaceholderText('Name'), 'Frank')
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'Tea')
    await user.click(screen.getByLabelText(/remember this one/i))
    await user.click(screen.getByText('Add Order'))

    // Go to AddOrder and click Custom
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByRole('button', { name: 'Custom' }))

    // Should show form pre-filled with Frank's data
    expect(screen.getByPlaceholderText('Name')).toHaveValue('Frank')
  })

  it('end run returns to no-run state', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByText('End Run'))
    await user.click(screen.getByText('End round'))

    expect(screen.getByText('Start a new Run')).toBeInTheDocument()
  })

  it('cancelling End Run dialog does not end the run', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByText('End Run'))
    await user.click(screen.getByText('Never mind'))

    expect(screen.getByText('End Run')).toBeInTheDocument()
    expect(screen.queryByText('Start a new Run')).not.toBeInTheDocument()
  })

  it('edit Order navigates to form pre-filled', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Add an Order first
    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByText('New Order'))
    await user.type(screen.getByPlaceholderText('Name'), 'Carol')
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'Coffee')
    await user.click(screen.getByText('Add Order'))

    // Click edit
    await user.click(screen.getByRole('button', { name: 'Edit Order' }))

    // Should show "Edit Order" title and Carol pre-filled
    expect(screen.getByText('Edit Order')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Name')).toHaveValue('Carol')
  })

  it('delete Order shows confirm dialog then removes the Order', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Add an Order
    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    await user.click(screen.getByText('New Order'))
    await user.type(screen.getByPlaceholderText('Name'), 'Dave')
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'Tea')
    await user.click(screen.getByText('Add Order'))

    expect(screen.getByText('Dave')).toBeInTheDocument()

    // Delete it
    await user.click(screen.getByRole('button', { name: 'Delete Order' }))
    await user.click(screen.getByText('Remove'))

    expect(screen.queryByText('Dave')).not.toBeInTheDocument()
  })

  it('shows Back button on mobile landing screen when active run exists', async () => {
    const user = userEvent.setup()

    // Persist an active run to localStorage via a desktop render
    mockUseBreakpoint.mockReturnValue('desktop')
    const { unmount } = render(<App />)
    await user.click(screen.getByText('Start a new Run'))
    unmount()

    // Fresh render on mobile — run restored from localStorage, screen defaults to 'landing'
    mockUseBreakpoint.mockReturnValue('mobile')
    render(<App />)

    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('Back from landing on mobile sets sidebar active', async () => {
    const user = userEvent.setup()

    mockUseBreakpoint.mockReturnValue('desktop')
    const { unmount } = render(<App />)
    await user.click(screen.getByText('Start a new Run'))
    unmount()

    mockUseBreakpoint.mockReturnValue('mobile')
    render(<App />)

    await user.click(screen.getByText('Back'))
    expect(screen.getByText('End Run')).toBeInTheDocument()
  })
})

describe('App — desktop layout', () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue('desktop')
  })

  it('renders DualPanelLayout structure with header and sidebar', () => {
    render(<App />)
    // Header is rendered with the app name
    expect(screen.getByText('Coffee Run')).toBeInTheDocument()
  })

  it('shows AddOrder with Back button in right panel when run is active', async () => {
    const user = userEvent.setup()
    render(<App />)

    // On desktop, the RunView is in the sidebar — start run button should be there
    await user.click(screen.getByText('Start a new Run'))

    // Right panel shows AddOrder with a Back button
    expect(screen.getByText('Add Order')).toBeInTheDocument()
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('right panel is empty when no active run', () => {
    render(<App />)
    // No AddOrder shown when no run active
    expect(screen.queryByText('New Order')).not.toBeInTheDocument()
  })

  it('clicking New Order shows OrderFormPage in right panel', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByText('New Order'))

    expect(screen.getByText('Pick a drink...')).toBeInTheDocument()
  })

  it('cancel from form in desktop returns to AddOrder panel', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByText('New Order'))
    expect(screen.getByText('Pick a drink...')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.queryByText('Pick a drink...')).not.toBeInTheDocument()
    expect(screen.getByText('New Order')).toBeInTheDocument()
  })

  it('updates an existing Order when edited from desktop', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByText('New Order'))
    await user.type(screen.getByPlaceholderText('Name'), 'Carol')
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'Coffee')
    await user.click(screen.getByText('Add Order'))

    await user.click(screen.getByRole('button', { name: 'Edit Order' }))

    const nameInput = screen.getByPlaceholderText('Name')
    await user.clear(nameInput)
    await user.type(nameInput, 'Diana')
    await user.click(screen.getByRole('button', { name: /update order/i }))

    expect(screen.getByText('Diana')).toBeInTheDocument()
  })

  it('Back button in Desktop navigates main panel to landing', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Start a new Run'))
    expect(screen.getByText('New Order')).toBeInTheDocument()
    await user.click(screen.getByText('Back'))
    expect(screen.queryByText('New Order')).not.toBeInTheDocument()
  })

  it('FAB is visible on Desktop when main panel shows landing with active run', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByText('Back'))
    expect(screen.getByRole('button', { name: 'Add Order' })).toBeInTheDocument()
  })

  it('FAB in Desktop on landing navigates to AddOrder', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Start a new Run'))
    await user.click(screen.getByText('Back'))
    await user.click(screen.getByRole('button', { name: 'Add Order' }))
    expect(screen.getByText('New Order')).toBeInTheDocument()
  })
})
