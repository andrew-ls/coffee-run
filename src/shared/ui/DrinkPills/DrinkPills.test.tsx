import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DrinkPills } from './DrinkPills'
import { createOrderFormData } from '@/test/fixtures'

describe('DrinkPills', () => {
  it('renders the drink type pill', () => {
    render(<DrinkPills order={createOrderFormData({ drinkType: 'Coffee', variant: '' })} />)
    expect(screen.getByText('Coffee')).toBeInTheDocument()
  })

  it('renders variant pill when variant is not Other', () => {
    render(<DrinkPills order={createOrderFormData({ drinkType: 'Coffee', variant: 'Latte' })} />)
    expect(screen.getByText('Latte')).toBeInTheDocument()
  })

  it('does not render variant pill when variant is Other', () => {
    render(<DrinkPills order={createOrderFormData({ variant: 'Other', customVariant: '' })} />)
    expect(screen.queryByText('Other')).not.toBeInTheDocument()
  })

  it('renders customVariant pill', () => {
    render(<DrinkPills order={createOrderFormData({ variant: 'Other', customVariant: 'Flat White' })} />)
    expect(screen.getByText('Flat White')).toBeInTheDocument()
  })

  it('renders customDrinkName pill', () => {
    render(<DrinkPills order={createOrderFormData({ customDrinkName: 'Mystery Brew' })} />)
    expect(screen.getByText('Mystery Brew')).toBeInTheDocument()
  })

  it('renders iced pill when iced is true', () => {
    render(<DrinkPills order={createOrderFormData({ iced: true })} />)
    expect(screen.getByText('Iced')).toBeInTheDocument()
  })

  it('does not render iced pill when iced is false', () => {
    render(<DrinkPills order={createOrderFormData({ iced: false })} />)
    expect(screen.queryByText('Iced')).not.toBeInTheDocument()
  })

  it('renders milk pill when milkType is not None', () => {
    render(<DrinkPills order={createOrderFormData({ milkType: 'Oat', milkAmount: 'Splash' })} />)
    expect(screen.getByText(/Oat/)).toBeInTheDocument()
  })

  it('does not render milk pill when milkType is None', () => {
    render(<DrinkPills order={createOrderFormData({ milkType: 'None' })} />)
    expect(screen.queryByText(/milk/i)).not.toBeInTheDocument()
  })

  it('renders sweetener pill when sweetenerType is not None', () => {
    render(
      <DrinkPills order={createOrderFormData({ sweetenerType: 'Sugar', sweetenerAmount: 2 })} />,
    )
    expect(screen.getByText(/Sugar/)).toBeInTheDocument()
  })

  it('does not render sweetener pill when sweetenerType is None', () => {
    render(<DrinkPills order={createOrderFormData({ sweetenerType: 'None' })} />)
    expect(screen.queryByText(/sweetener/i)).not.toBeInTheDocument()
  })
})
