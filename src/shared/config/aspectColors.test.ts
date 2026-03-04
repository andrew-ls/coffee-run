import { describe, it, expect } from 'vitest'
import { ASPECT_COLORS } from './aspectColors'

describe('ASPECT_COLORS', () => {
  it('has iced, variant, milk, and sweetener keys', () => {
    expect(Object.keys(ASPECT_COLORS)).toEqual(['iced', 'variant', 'milk', 'sweetener'])
  })

  it.each(Object.entries(ASPECT_COLORS))('%s has background and text properties', (_key, value) => {
    expect(value).toHaveProperty('background')
    expect(value).toHaveProperty('text')
    expect(typeof value.background).toBe('string')
    expect(typeof value.text).toBe('string')
  })
})
