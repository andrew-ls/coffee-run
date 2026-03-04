import { describe, it, expect } from 'vitest'
import { SWEETENER_TYPES, SWEETENER_MIN, SWEETENER_MAX, SWEETENER_STEP } from './sweetener'

describe('SWEETENER_TYPES', () => {
  it('includes None', () => {
    expect(SWEETENER_TYPES).toContain('None')
  })

  it('has 5 entries', () => {
    expect(SWEETENER_TYPES).toHaveLength(5)
  })
})

describe('SWEETENER constants', () => {
  it('SWEETENER_MIN is 0', () => {
    expect(SWEETENER_MIN).toBe(0)
  })

  it('SWEETENER_MAX is 5', () => {
    expect(SWEETENER_MAX).toBe(5)
  })

  it('SWEETENER_STEP is 0.5', () => {
    expect(SWEETENER_STEP).toBe(0.5)
  })
})
