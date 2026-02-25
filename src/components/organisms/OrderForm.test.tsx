import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrderForm } from './OrderForm'

describe('OrderForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  }

  // The drink type select is always the first combobox on the form
  function getDrinkSelect() {
    return screen.getAllByRole('combobox')[0]
  }

  it('renders the who-for field', () => {
    render(<OrderForm {...defaultProps} />)
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
  })

  it('renders drink type selector with placeholder', () => {
    render(<OrderForm {...defaultProps} />)
    expect(screen.getByText('Pick a drink...')).toBeInTheDocument()
  })

  it('submit button is disabled when no drink type is selected', () => {
    render(<OrderForm {...defaultProps} />)
    expect(screen.getByRole('button', { name: /add order/i })).toBeDisabled()
  })

  it('submit button is enabled once a drink type is selected', async () => {
    const user = userEvent.setup()
    render(<OrderForm {...defaultProps} />)
    await user.selectOptions(getDrinkSelect(), 'Coffee')
    expect(screen.getByRole('button', { name: /add order/i })).not.toBeDisabled()
  })

  it('does not call onSubmit when personName is empty', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<OrderForm onSubmit={onSubmit} onCancel={vi.fn()} />)
    await user.selectOptions(getDrinkSelect(), 'Coffee')
    const form = document.querySelector('form')!
    fireEvent.submit(form)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn()
    render(<OrderForm onSubmit={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  describe('Coffee fields', () => {
    async function renderWithCoffee() {
      const user = userEvent.setup()
      render(<OrderForm {...defaultProps} />)
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      return user
    }

    it('shows Iced checkbox', async () => {
      await renderWithCoffee()
      expect(screen.getByLabelText('Iced')).toBeInTheDocument()
    })

    it('shows Milk label', async () => {
      await renderWithCoffee()
      expect(screen.getByText('Milk')).toBeInTheDocument()
    })

    it('shows Sweetener label', async () => {
      await renderWithCoffee()
      expect(screen.getByText('Sweetener', { selector: 'span' })).toBeInTheDocument()
    })

    it('shows Notes label', async () => {
      await renderWithCoffee()
      expect(screen.getByText('Notes')).toBeInTheDocument()
    })

    it('shows Variant label', async () => {
      await renderWithCoffee()
      expect(screen.getByText('Variant')).toBeInTheDocument()
    })
  })

  describe('Hot Chocolate fields', () => {
    async function renderWithHotChoc() {
      const user = userEvent.setup()
      render(<OrderForm {...defaultProps} />)
      await user.selectOptions(getDrinkSelect(), 'Hot Chocolate')
      return user
    }

    it('does not show Iced checkbox', async () => {
      await renderWithHotChoc()
      expect(screen.queryByLabelText('Iced')).not.toBeInTheDocument()
    })

    it('does not show Sweetener label', async () => {
      await renderWithHotChoc()
      expect(screen.queryByText('Sweetener')).not.toBeInTheDocument()
    })

    it('shows Milk label', async () => {
      await renderWithHotChoc()
      expect(screen.getByText('Milk')).toBeInTheDocument()
    })
  })

  describe('Juice fields', () => {
    async function renderWithJuice() {
      const user = userEvent.setup()
      render(<OrderForm {...defaultProps} />)
      await user.selectOptions(getDrinkSelect(), 'Juice')
      return user
    }

    it('does not show Milk or Sweetener', async () => {
      await renderWithJuice()
      expect(screen.queryByText('Milk')).not.toBeInTheDocument()
      expect(screen.queryByText('Sweetener')).not.toBeInTheDocument()
    })

    it('does not show Iced', async () => {
      await renderWithJuice()
      expect(screen.queryByLabelText('Iced')).not.toBeInTheDocument()
    })
  })

  describe('Other drink type', () => {
    it('shows custom drink name field', async () => {
      const user = userEvent.setup()
      render(<OrderForm {...defaultProps} />)
      await user.selectOptions(getDrinkSelect(), 'Other')
      expect(screen.getByText("What drink?")).toBeInTheDocument()
    })
  })

  describe('Other variant', () => {
    it('shows custom variant field when "Other" variant is selected', async () => {
      const user = userEvent.setup()
      render(<OrderForm {...defaultProps} />)
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      // Variant select is the second combobox after drink type
      const variantSelect = screen.getAllByRole('combobox')[1]
      await user.selectOptions(variantSelect, 'Other')
      expect(screen.getByText('Custom variant')).toBeInTheDocument()
    })
  })

  describe('milk amount visibility', () => {
    it('hides milk amount when milkType is None', async () => {
      const user = userEvent.setup()
      render(<OrderForm {...defaultProps} />)
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      // Milk type is combobox[2] (drinkType=0, variant=1, milkType=2)
      const milkSelect = screen.getAllByRole('combobox')[2]
      await user.selectOptions(milkSelect, 'None')
      expect(screen.queryByText('How much?')).not.toBeInTheDocument()
    })

    it('shows milk amount when milkType is not None', async () => {
      const user = userEvent.setup()
      render(<OrderForm {...defaultProps} />)
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      const milkSelect = screen.getAllByRole('combobox')[2]
      await user.selectOptions(milkSelect, 'Oat')
      expect(screen.getByText('How much?')).toBeInTheDocument()
    })
  })

  describe('sweetener amount visibility', () => {
    it('shows sweetener amount when sweetenerType is not None', async () => {
      const user = userEvent.setup()
      render(<OrderForm {...defaultProps} />)
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      // Sweetener type is combobox[3] (drinkType=0, variant=1, milkType=2, sweetenerType=3)
      const sweetenerSelect = screen.getAllByRole('combobox')[3]
      await user.selectOptions(sweetenerSelect, 'Sugar')
      expect(screen.getByText('How many?')).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('calls onSubmit with form data and saveForLater=false by default', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()
      render(<OrderForm onSubmit={onSubmit} onCancel={vi.fn()} />)

      await user.type(screen.getByPlaceholderText('Name'), 'Alice')
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      await user.click(screen.getByRole('button', { name: /add order/i }))

      expect(onSubmit).toHaveBeenCalledOnce()
      const [data, save] = onSubmit.mock.calls[0] as [{ personName: string; drinkType: string }, boolean]
      expect(data.personName).toBe('Alice')
      expect(data.drinkType).toBe('Coffee')
      expect(save).toBe(false)
    })

    it('calls onSubmit with saveForLater=true when checkbox is checked', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()
      render(<OrderForm onSubmit={onSubmit} onCancel={vi.fn()} />)

      await user.type(screen.getByPlaceholderText('Name'), 'Bob')
      await user.selectOptions(getDrinkSelect(), 'Tea')
      await user.click(screen.getByLabelText(/remember this one/i))
      await user.click(screen.getByRole('button', { name: /add order/i }))

      expect(onSubmit).toHaveBeenCalledOnce()
      const [, save] = onSubmit.mock.calls[0] as [unknown, boolean]
      expect(save).toBe(true)
    })
  })

  describe('initialData', () => {
    it('pre-fills form fields from initialData', () => {
      render(
        <OrderForm
          initialData={{ personName: 'Carol', drinkType: 'Tea' }}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />,
      )
      expect(screen.getByPlaceholderText('Name')).toHaveValue('Carol')
    })

    it('uses custom submitLabel when provided', () => {
      render(<OrderForm onSubmit={vi.fn()} onCancel={vi.fn()} submitLabel="Update order" />)
      expect(screen.getByRole('button', { name: 'Update order' })).toBeInTheDocument()
    })
  })

  describe('milk amount', () => {
    it('changing milk amount updates submitted form data', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()
      render(<OrderForm onSubmit={onSubmit} onCancel={vi.fn()} />)

      await user.type(screen.getByPlaceholderText('Name'), 'Alice')
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      // Select a non-None milk type to reveal the milk amount select
      await user.selectOptions(screen.getAllByRole('combobox')[2], 'Oat')
      // Milk amount is now combobox[3]; change to 'Splosh'
      await user.selectOptions(screen.getAllByRole('combobox')[3], 'Splosh')
      await user.click(screen.getByRole('button', { name: /add order/i }))

      const [data] = onSubmit.mock.calls[0] as [{ milkAmount: string }]
      expect(data.milkAmount).toBe('Splosh')
    })
  })

  describe('sweetener amount', () => {
    it('changing sweetener amount updates submitted form data', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()
      render(<OrderForm onSubmit={onSubmit} onCancel={vi.fn()} />)

      await user.type(screen.getByPlaceholderText('Name'), 'Bob')
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      // Select a non-None sweetener type to reveal the sweetener amount input
      // With Coffee selected and milkType=None: combobox[3] is sweetenerType
      const sweetenerSelect = screen.getAllByRole('combobox')[3]
      await user.selectOptions(sweetenerSelect, 'Sugar')
      // Number input for sweetener amount should be visible
      const amountInput = screen.getByRole('spinbutton')
      await user.clear(amountInput)
      await user.type(amountInput, '2')
      await user.click(screen.getByRole('button', { name: /add order/i }))

      const [data] = onSubmit.mock.calls[0] as [{ sweetenerAmount: number }]
      expect(data.sweetenerAmount).toBe(2)
    })
  })

  describe('field onChange handlers', () => {
    it('typing in customDrinkName updates form data', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()
      render(<OrderForm onSubmit={onSubmit} onCancel={vi.fn()} />)

      await user.type(screen.getByPlaceholderText('Name'), 'Alice')
      await user.selectOptions(getDrinkSelect(), 'Other')
      await user.type(screen.getByPlaceholderText('Describe the drink'), 'Matcha Latte')
      await user.click(screen.getByRole('button', { name: /add order/i }))

      const [data] = onSubmit.mock.calls[0] as [{ customDrinkName: string }]
      expect(data.customDrinkName).toBe('Matcha Latte')
    })

    it('typing in customVariant updates form data', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()
      render(<OrderForm onSubmit={onSubmit} onCancel={vi.fn()} />)

      await user.type(screen.getByPlaceholderText('Name'), 'Bob')
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      await user.selectOptions(screen.getAllByRole('combobox')[1], 'Other')
      await user.type(screen.getByPlaceholderText('What kind?'), 'Hazelnut')
      await user.click(screen.getByRole('button', { name: /add order/i }))

      const [data] = onSubmit.mock.calls[0] as [{ customVariant: string }]
      expect(data.customVariant).toBe('Hazelnut')
    })

    it('checking iced checkbox updates form data', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()
      render(<OrderForm onSubmit={onSubmit} onCancel={vi.fn()} />)

      await user.type(screen.getByPlaceholderText('Name'), 'Carol')
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      await user.click(screen.getByLabelText('Iced'))
      await user.click(screen.getByRole('button', { name: /add order/i }))

      const [data] = onSubmit.mock.calls[0] as [{ iced: boolean }]
      expect(data.iced).toBe(true)
    })

    it('typing in notes updates form data', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()
      render(<OrderForm onSubmit={onSubmit} onCancel={vi.fn()} />)

      await user.type(screen.getByPlaceholderText('Name'), 'Dave')
      await user.selectOptions(getDrinkSelect(), 'Coffee')
      await user.type(screen.getByPlaceholderText('Extra shot, no foam, etc.'), 'oat milk please')
      await user.click(screen.getByRole('button', { name: /add order/i }))

      const [data] = onSubmit.mock.calls[0] as [{ notes: string }]
      expect(data.notes).toBe('oat milk please')
    })
  })
})
