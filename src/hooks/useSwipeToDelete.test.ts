import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSwipeToDelete } from './useSwipeToDelete'

function createTouchEvent(clientX: number) {
  return { touches: [{ clientX }] } as unknown as React.TouchEvent
}

function createTransitionEvent(propertyName: string) {
  return { propertyName } as unknown as React.TransitionEvent
}

describe('useSwipeToDelete', () => {
  describe('non-touch device', () => {
    it('returns undefined swipeStyle and empty touchHandlers', () => {
      const { result } = renderHook(() => useSwipeToDelete())
      expect(result.current.swipeStyle).toBeUndefined()
      expect(result.current.touchHandlers).toEqual({})
      expect(result.current.swipeDirection).toBeNull()
    })
  })

  describe('touch device', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(pointer: coarse)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    })

    it('returns swipeStyle with transform and touch handlers', () => {
      const { result } = renderHook(() => useSwipeToDelete())
      expect(result.current.swipeStyle).toEqual({ transform: 'translateX(0px)' })
      expect(result.current.touchHandlers).toHaveProperty('onTouchStart')
      expect(result.current.touchHandlers).toHaveProperty('onTouchMove')
      expect(result.current.touchHandlers).toHaveProperty('onTouchEnd')
      expect(result.current.touchHandlers).toHaveProperty('onTransitionEnd')
    })

    it('sets negative offset and left direction on left swipe', () => {
      const { result } = renderHook(() => useSwipeToDelete())
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(70))
      })
      expect(result.current.swipeStyle).toEqual({ transform: 'translateX(-30px)' })
      expect(result.current.swipeDirection).toBe('left')
    })

    it('sets positive offset and right direction when enableRightSwipe is true', () => {
      const { result } = renderHook(() => useSwipeToDelete({ enableRightSwipe: true }))
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(150))
      })
      expect(result.current.swipeStyle).toEqual({ transform: 'translateX(50px)' })
      expect(result.current.swipeDirection).toBe('right')
    })

    it('resets offset to 0 when swiping right with enableRightSwipe false', () => {
      const { result } = renderHook(() => useSwipeToDelete({ enableRightSwipe: false }))
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(150))
      })
      expect(result.current.swipeStyle).toEqual({ transform: 'translateX(0px)' })
      expect(result.current.swipeDirection).toBeNull()
    })

    it('snaps to negative snap width past left threshold', () => {
      const { result } = renderHook(() => useSwipeToDelete())
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(200))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchEnd!({} as React.TouchEvent)
      })
      // No snapLeftRef provided, so uses SNAP_FALLBACK = 100
      expect(result.current.swipeStyle).toEqual({ transform: 'translateX(-100px)' })
    })

    it('snaps to positive snap width past right threshold', () => {
      const { result } = renderHook(() => useSwipeToDelete({ enableRightSwipe: true }))
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(0))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchEnd!({} as React.TouchEvent)
      })
      // No snapRightRef provided, so uses SNAP_FALLBACK = 100
      expect(result.current.swipeStyle).toEqual({ transform: 'translateX(100px)' })
    })

    it('snaps back to 0 when below threshold', () => {
      const { result } = renderHook(() => useSwipeToDelete())
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(70))
      })
      act(() => {
        result.current.touchHandlers.onTouchEnd!({} as React.TouchEvent)
      })
      expect(result.current.swipeStyle).toEqual({ transform: 'translateX(0px)' })
    })

    it('uses snapLeftRef offsetWidth when provided', () => {
      const snapLeftRef = { current: { offsetWidth: 120 } as HTMLElement }
      const { result } = renderHook(() => useSwipeToDelete({ snapLeftRef }))
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(200))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchEnd!({} as React.TouchEvent)
      })
      expect(result.current.swipeStyle).toEqual({ transform: 'translateX(-120px)' })
    })

    it('uses snapRightRef offsetWidth when provided', () => {
      const snapRightRef = { current: { offsetWidth: 90 } as HTMLElement }
      const { result } = renderHook(() =>
        useSwipeToDelete({ enableRightSwipe: true, snapRightRef }),
      )
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(0))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchEnd!({} as React.TouchEvent)
      })
      expect(result.current.swipeStyle).toEqual({ transform: 'translateX(90px)' })
    })

    it('clears swipeDirection on transitionEnd with transform when offset is 0', () => {
      const { result } = renderHook(() => useSwipeToDelete())
      // Swipe left below threshold, then touch end to snap back to 0
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(70))
      })
      act(() => {
        result.current.touchHandlers.onTouchEnd!({} as React.TouchEvent)
      })
      expect(result.current.swipeDirection).toBe('left')
      act(() => {
        result.current.touchHandlers.onTransitionEnd!(createTransitionEvent('transform'))
      })
      expect(result.current.swipeDirection).toBeNull()
    })

    it('does not clear swipeDirection for non-transform transitionEnd', () => {
      const { result } = renderHook(() => useSwipeToDelete())
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(70))
      })
      act(() => {
        result.current.touchHandlers.onTouchEnd!({} as React.TouchEvent)
      })
      act(() => {
        result.current.touchHandlers.onTransitionEnd!(createTransitionEvent('opacity'))
      })
      expect(result.current.swipeDirection).toBe('left')
    })

    it('does not clear swipeDirection on transitionEnd when offset is not 0', () => {
      const { result } = renderHook(() => useSwipeToDelete())
      // Swipe left past threshold so card snaps to -100
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(200))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchEnd!({} as React.TouchEvent)
      })
      act(() => {
        result.current.touchHandlers.onTransitionEnd!(createTransitionEvent('transform'))
      })
      // offset is -100, not 0, so direction is preserved
      expect(result.current.swipeDirection).toBe('left')
    })

    it('continues swipe relative to locked position', () => {
      const { result } = renderHook(() => useSwipeToDelete())
      // Lock card at -100 (left swipe past threshold)
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(200))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(100))
      })
      act(() => {
        result.current.touchHandlers.onTouchEnd!({} as React.TouchEvent)
      })
      // Start a new touch from x=150, drag right 30px
      act(() => {
        result.current.touchHandlers.onTouchStart!(createTouchEvent(150))
      })
      act(() => {
        result.current.touchHandlers.onTouchMove!(createTouchEvent(180))
      })
      expect(result.current.swipeStyle).toEqual({ transform: 'translateX(-70px)' })
    })
  })
})
