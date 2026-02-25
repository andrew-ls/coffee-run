import { describe, it, expect, vi } from 'vitest'
import { generateId } from './id'

describe('generateId', () => {
  it('returns a string', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
  })

  it('returns a non-empty string', () => {
    const id = generateId()
    expect(id.length).toBeGreaterThan(0)
  })

  it('calls crypto.randomUUID', () => {
    generateId()
    expect(crypto.randomUUID).toHaveBeenCalledOnce()
  })

  it('returns value from crypto.randomUUID', () => {
    vi.mocked(crypto.randomUUID).mockReturnValueOnce('known-uuid-1234-5678-abcd-ef0123456789')
    const id = generateId()
    expect(id).toBe('known-uuid-1234-5678-abcd-ef0123456789')
  })
})
