import { describe, it, expect } from 'vitest'
import { MILK_TYPES, MILK_AMOUNTS } from './milk'

describe('MILK_TYPES', () => {
  it('includes None', () => {
    expect(MILK_TYPES).toContain('None')
  })

  it('includes common types', () => {
    expect(MILK_TYPES).toContain('Regular')
    expect(MILK_TYPES).toContain('Oat')
    expect(MILK_TYPES).toContain('Soy')
  })

  it('has 8 entries', () => {
    expect(MILK_TYPES).toHaveLength(8)
  })
})

describe('MILK_AMOUNTS', () => {
  it('has Splish, Splash, Splosh', () => {
    expect(MILK_AMOUNTS).toEqual(['Splish', 'Splash', 'Splosh'])
  })
})
