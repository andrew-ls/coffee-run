import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateId } from './id'

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string')
  })

  it('returns a non-empty string', () => {
    expect(generateId().length).toBeGreaterThan(0)
  })

  describe('when crypto.randomUUID is available', () => {
    it('calls crypto.randomUUID', () => {
      generateId()
      expect(crypto.randomUUID).toHaveBeenCalledOnce()
    })

    it('returns the value from crypto.randomUUID', () => {
      vi.mocked(crypto.randomUUID).mockReturnValueOnce('known-uuid-1234-5678-abcd-ef0123456789')
      expect(generateId()).toBe('known-uuid-1234-5678-abcd-ef0123456789')
    })
  })

  describe('when crypto.randomUUID is unavailable', () => {
    beforeEach(() => {
      Object.defineProperty(globalThis.crypto, 'randomUUID', {
        configurable: true,
        value: undefined,
      })
    })

    it('returns a UUID v4 format string', () => {
      expect(generateId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      )
    })

    it('returns unique values', () => {
      expect(generateId()).not.toBe(generateId())
    })
  })
})
