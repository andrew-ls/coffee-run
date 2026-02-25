export interface DrinkConfig {
  type: string
  variants: readonly string[]
  allowOtherVariant: boolean
  allowCustomDrinkName: boolean
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
    fields: { iced: true, milk: true, milkAmount: true, sweetener: true, sweetenerAmount: true, notes: true },
  },
  {
    type: 'Tea',
    variants: ['English Breakfast', 'Earl Grey', 'Green', 'Peppermint', 'Chamomile'],
    allowOtherVariant: true,
    allowCustomDrinkName: false,
    fields: { iced: true, milk: true, milkAmount: true, sweetener: true, sweetenerAmount: true, notes: true },
  },
  {
    type: 'Hot Chocolate',
    variants: ['Classic', 'White', 'Mint'],
    allowOtherVariant: false,
    allowCustomDrinkName: false,
    fields: { iced: false, milk: true, milkAmount: true, sweetener: false, sweetenerAmount: false, notes: true },
  },
  {
    type: 'Juice',
    variants: ['Orange', 'Apple', 'Cranberry'],
    allowOtherVariant: true,
    allowCustomDrinkName: false,
    fields: { iced: false, milk: false, milkAmount: false, sweetener: false, sweetenerAmount: false, notes: true },
  },
  {
    type: 'Other',
    variants: [],
    allowOtherVariant: false,
    allowCustomDrinkName: true,
    fields: { iced: false, milk: false, milkAmount: false, sweetener: false, sweetenerAmount: false, notes: true },
  },
] as const

export const DRINK_TYPES = DRINKS.map((d) => d.type)
