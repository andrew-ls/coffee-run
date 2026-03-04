import { describe, it, expect } from 'vitest'
import { DRINKS, DRINK_TYPES } from './drinks'

describe('DRINKS', () => {
  it('has exactly 5 entries', () => {
    expect(DRINKS).toHaveLength(5)
  })

  it('includes Coffee, Tea, Hot Chocolate, Juice, and Other', () => {
    const types = DRINKS.map((d) => d.type)
    expect(types).toContain('Coffee')
    expect(types).toContain('Tea')
    expect(types).toContain('Hot Chocolate')
    expect(types).toContain('Juice')
    expect(types).toContain('Other')
  })

  describe('Coffee', () => {
    const coffee = DRINKS.find((d) => d.type === 'Coffee')!

    it('has iced, milk, and sweetener fields', () => {
      expect(coffee.fields.iced).toBe(true)
      expect(coffee.fields.milk).toBe(true)
      expect(coffee.fields.milkAmount).toBe(true)
      expect(coffee.fields.sweetener).toBe(true)
      expect(coffee.fields.sweetenerAmount).toBe(true)
      expect(coffee.fields.notes).toBe(true)
    })

    it('allows other variant', () => {
      expect(coffee.allowOtherVariant).toBe(true)
    })

    it('does not allow custom drink name', () => {
      expect(coffee.allowCustomDrinkName).toBe(false)
    })
  })

  describe('Hot Chocolate', () => {
    const hotChoc = DRINKS.find((d) => d.type === 'Hot Chocolate')!

    it('has no iced or sweetener fields', () => {
      expect(hotChoc.fields.iced).toBe(false)
      expect(hotChoc.fields.sweetener).toBe(false)
      expect(hotChoc.fields.sweetenerAmount).toBe(false)
    })

    it('has milk field', () => {
      expect(hotChoc.fields.milk).toBe(true)
    })

    it('does not allow other variant', () => {
      expect(hotChoc.allowOtherVariant).toBe(false)
    })
  })

  describe('Juice', () => {
    const juice = DRINKS.find((d) => d.type === 'Juice')!

    it('has no milk or sweetener fields', () => {
      expect(juice.fields.milk).toBe(false)
      expect(juice.fields.milkAmount).toBe(false)
      expect(juice.fields.sweetener).toBe(false)
      expect(juice.fields.sweetenerAmount).toBe(false)
    })

    it('has no iced field', () => {
      expect(juice.fields.iced).toBe(false)
    })

    it('has notes field', () => {
      expect(juice.fields.notes).toBe(true)
    })
  })

  describe('Other', () => {
    const other = DRINKS.find((d) => d.type === 'Other')!

    it('allows custom drink name', () => {
      expect(other.allowCustomDrinkName).toBe(true)
    })

    it('has empty variants', () => {
      expect(other.variants).toHaveLength(0)
    })

    it('has no iced, milk, or sweetener fields', () => {
      expect(other.fields.iced).toBe(false)
      expect(other.fields.milk).toBe(false)
      expect(other.fields.sweetener).toBe(false)
    })
  })
})

describe('DRINK_TYPES', () => {
  it('matches DRINKS map of types', () => {
    expect(DRINK_TYPES).toEqual(DRINKS.map((d) => d.type))
  })
})
