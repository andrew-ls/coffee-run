import { useRef, useState, useCallback } from 'react'
import { useBreakpoint } from './useBreakpoint'

const SWIPE_THRESHOLD = 80

export function useSwipeToDelete() {
  const breakpoint = useBreakpoint()
  const startX = useRef(0)
  const [offsetX, setOffsetX] = useState(0)
  const [swiped, setSwiped] = useState(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - startX.current
    if (diff < 0) setOffsetX(diff)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (offsetX < -SWIPE_THRESHOLD) {
      setSwiped(true)
      setOffsetX(-SWIPE_THRESHOLD - 20)
    } else {
      setOffsetX(0)
    }
  }, [offsetX])

  const isMobile = breakpoint === 'mobile'

  return {
    swiped,
    isMobile,
    swipeStyle: isMobile ? { transform: `translateX(${offsetX}px)` } : undefined,
    touchHandlers: isMobile
      ? { onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd }
      : {},
  }
}
