import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBreakpoint } from './useBreakpoint'

function makeMql(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = []
  const mql = {
    matches,
    media: '(min-width: 768px)',
    onchange: null,
    addEventListener: vi.fn((_type: string, fn: (e: MediaQueryListEvent) => void) => {
      listeners.push(fn)
    }),
    removeEventListener: vi.fn((_type: string, fn: (e: MediaQueryListEvent) => void) => {
      const i = listeners.indexOf(fn)
      if (i !== -1) listeners.splice(i, 1)
    }),
    dispatchEvent: vi.fn(),
    trigger: (m: boolean) => {
      const event = { matches: m } as MediaQueryListEvent
      listeners.forEach((fn) => fn(event))
    },
  }
  return mql
}

describe('useBreakpoint', () => {
  it('returns mobile when matchMedia does not match', () => {
    const mql = makeMql(false)
    vi.mocked(window.matchMedia).mockReturnValue(mql as unknown as MediaQueryList)

    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('mobile')
  })

  it('returns desktop when matchMedia matches', () => {
    const mql = makeMql(true)
    vi.mocked(window.matchMedia).mockReturnValue(mql as unknown as MediaQueryList)

    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('desktop')
  })

  it('updates to desktop when media query fires a match', () => {
    const mql = makeMql(false)
    vi.mocked(window.matchMedia).mockReturnValue(mql as unknown as MediaQueryList)

    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('mobile')

    act(() => {
      mql.trigger(true)
    })
    expect(result.current).toBe('desktop')
  })

  it('updates to mobile when media query fires no match', () => {
    const mql = makeMql(true)
    vi.mocked(window.matchMedia).mockReturnValue(mql as unknown as MediaQueryList)

    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('desktop')

    act(() => {
      mql.trigger(false)
    })
    expect(result.current).toBe('mobile')
  })

  it('removes event listener on unmount', () => {
    const mql = makeMql(false)
    vi.mocked(window.matchMedia).mockReturnValue(mql as unknown as MediaQueryList)

    const { unmount } = renderHook(() => useBreakpoint())
    unmount()
    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
