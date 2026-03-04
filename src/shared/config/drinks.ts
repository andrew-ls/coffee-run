import type { PillColor } from './aspectColors'

export interface DrinkConfig {
  type: string
  variants: readonly string[]
  allowOtherVariant: boolean
  allowCustomDrinkName: boolean
  pillColor: PillColor
  fields: {
    iced: boolean
    milk: boolean
    milkAmount: boolean
    sweetener: boolean
    sweetenerAmount: boolean
    notes: boolean
  }
}

export const DRINKS: readonly DrinkConfig[] = [
  {
    type: 'Coffee',
    variants: ['Americano', 'Latte', 'Cappuccino', 'Flat White', 'Espresso', 'Mocha'],
    allowOtherVariant: true,
    allowCustomDrinkName: false,
    pillColor: { background: '#F0E0CC', text: 'var(--color-primary)' },
    fields: { iced: true, milk: true, milkAmount: true, sweetener: true, sweetenerAmount: true, notes: true },
  },
  {
    type: 'Tea',
    variants: ['English Breakfast', 'Earl Grey', 'Green', 'Peppermint', 'Chamomile'],
    allowOtherVariant: true,
    allowCustomDrinkName: false,
    pillColor: { background: '#E8F5E9', text: '#2E7D32' },
    fields: { iced: true, milk: true, milkAmount: true, sweetener: true, sweetenerAmount: true, notes: true },
  },
  {
    type: 'Hot Chocolate',
    variants: ['Classic', 'White', 'Mint'],
    allowOtherVariant: false,
    allowCustomDrinkName: false,
    pillColor: { background: '#F3E5F5', text: '#6A1B9A' },
    fields: { iced: false, milk: true, milkAmount: true, sweetener: false, sweetenerAmount: false, notes: true },
  },
  {
    type: 'Juice',
    variants: ['Orange', 'Apple', 'Cranberry'],
    allowOtherVariant: true,
    allowCustomDrinkName: false,
    pillColor: { background: '#FFF3E0', text: '#E65100' },
    fields: { iced: false, milk: false, milkAmount: false, sweetener: false, sweetenerAmount: false, notes: true },
  },
  {
    type: 'Other',
    variants: [],
    allowOtherVariant: false,
    allowCustomDrinkName: true,
    pillColor: { background: '#E0E0E0', text: '#616161' },
    fields: { iced: false, milk: false, milkAmount: false, sweetener: false, sweetenerAmount: false, notes: true },
  },
] as const

export const DRINK_TYPES = DRINKS.map((d) => d.type)
