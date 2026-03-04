import { describe, it, expect, vi } from 'vitest'
import { now } from './time'

describe('now', () => {
  it('returns a string', () => {
    expect(typeof now()).toBe('string')
  })

  it('returns a valid ISO 8601 string', () => {
    const result = now()
    expect(() => new Date(result)).not.toThrow()
    expect(new Date(result).toISOString()).toBe(result)
  })

  it('reflects the current system time', () => {
    const fixedDate = new Date('2024-01-15T12:00:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(fixedDate)

    const result = now()
    expect(result).toBe('2024-01-15T12:00:00.000Z')

    vi.useRealTimers()
  })
})
