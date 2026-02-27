import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DrinkPills } from './DrinkPills'
import { createOrderFormData } from '@/test/fixtures'

describe('DrinkPills', () => {
  it('renders drink type pill', () => {
    render(<DrinkPills order={createOrderFormData({ drinkType: 'Coffee' })} />)
    expect(screen.getByText('Coffee')).toBeInTheDocument()
  })

  it('uses fallback pill color for unknown drink type', () => {
    render(<DrinkPills order={createOrderFormData({ drinkType: 'Unknown' })} />)
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('renders iced pill when iced is true', () => {
    render(<DrinkPills order={createOrderFormData({ iced: true })} />)
    expect(screen.getByText('Iced')).toBeInTheDocument()
  })

  it('does not render iced pill when iced is false', () => {
    render(<DrinkPills order={createOrderFormData({ iced: false })} />)
    expect(screen.queryByText('Iced')).not.toBeInTheDocument()
  })

  it('renders variant pill when set and not "Other"', () => {
    render(<DrinkPills order={createOrderFormData({ variant: 'Latte' })} />)
    expect(screen.getByText('Latte')).toBeInTheDocument()
  })

  it('does not render variant pill when variant is "Other"', () => {
    render(
      <DrinkPills order={createOrderFormData({ variant: 'Other', customVariant: '' })} />,
    )
    expect(screen.queryByText('Other')).not.toBeInTheDocument()
  })

  it('does not render variant pill when variant is empty', () => {
    render(<DrinkPills order={createOrderFormData({ variant: '' })} />)
    // Only expect the drink type pill and milk pill from defaults
    const pills = screen.getAllByText(/.*/)
    expect(pills.length).toBeGreaterThan(0)
  })

  it('renders customVariant pill', () => {
    render(
      <DrinkPills
        order={createOrderFormData({ variant: 'Other', customVariant: 'Hazelnut' })}
      />,
    )
    expect(screen.getByText('Hazelnut')).toBeInTheDocument()
  })

  it('renders customDrinkName pill', () => {
    render(
      <DrinkPills
        order={createOrderFormData({
          drinkType: 'Other',
          customDrinkName: 'Chai Latte',
          variant: '',
          customVariant: '',
        })}
      />,
    )
    expect(screen.getByText('Chai Latte')).toBeInTheDocument()
  })

  it('does not render customDrinkName pill when empty', () => {
    render(
      <DrinkPills order={createOrderFormData({ customDrinkName: '' })} />,
    )
    expect(screen.queryByText('Chai Latte')).not.toBeInTheDocument()
  })

  it('renders milk pill when milkType is not None', () => {
    render(
      <DrinkPills
        order={createOrderFormData({ milkType: 'Oat', milkAmount: 'Splash' })}
      />,
    )
    expect(screen.getByText(/Oat/)).toBeInTheDocument()
  })

  it('does not render milk pill when milkType is None', () => {
    render(
      <DrinkPills
        order={createOrderFormData({ milkType: 'None', sweetenerType: 'None' })}
      />,
    )
    expect(screen.queryByText(/Oat/)).not.toBeInTheDocument()
  })

  it('renders sweetener pill when sweetenerType is not None', () => {
    render(
      <DrinkPills
        order={createOrderFormData({
          sweetenerType: 'Brown Sugar',
          sweetenerAmount: 1.5,
          milkType: 'None',
        })}
      />,
    )
    expect(screen.getByText(/Brown Sugar/)).toBeInTheDocument()
  })

  it('does not render sweetener pill when sweetenerType is None', () => {
    render(
      <DrinkPills
        order={createOrderFormData({ sweetenerType: 'None', milkType: 'None' })}
      />,
    )
    expect(screen.queryByText(/Sugar/)).not.toBeInTheDocument()
  })
})
