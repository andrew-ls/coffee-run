import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  it('returns initialValue when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 42))
    expect(result.current[0]).toBe(42)
  })

  it('reads existing value from storage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('stored')
  })

  it('falls back to initialValue on malformed JSON', () => {
    localStorage.setItem('test-key', 'not-valid-json{{{')
    const { result } = renderHook(() => useLocalStorage('test-key', 99))
    expect(result.current[0]).toBe(99)
  })

  it('writes value to storage on set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    act(() => {
      result.current[1]('updated')
    })
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'))
    expect(result.current[0]).toBe('updated')
  })

  it('accepts a functional updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 10))
    act(() => {
      result.current[1]((prev) => prev + 5)
    })
    expect(result.current[0]).toBe(15)
  })

  it('updates state on storage event for matching key', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'test-key',
          newValue: JSON.stringify('from-other-tab'),
        }),
      )
    })

    expect(result.current[0]).toBe('from-other-tab')
  })

  it('ignores storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'other-key',
          newValue: JSON.stringify('ignored'),
        }),
      )
    })

    expect(result.current[0]).toBe('initial')
  })

  it('ignores storage events with null newValue', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'test-key',
          newValue: null,
        }),
      )
    })

    expect(result.current[0]).toBe('initial')
  })

  it('removes event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useLocalStorage('test-key', 'x'))
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('storage', expect.any(Function))
  })
})
