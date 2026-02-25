import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useUserId } from './useUserId'

describe('useUserId', () => {
  it('returns a string', () => {
    const { result } = renderHook(() => useUserId())
    expect(typeof result.current).toBe('string')
  })

  it('returns default-user', () => {
    const { result } = renderHook(() => useUserId())
    expect(result.current).toBe('default-user')
  })
})
