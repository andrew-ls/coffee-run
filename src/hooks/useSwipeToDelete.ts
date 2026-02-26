import { useRef, useState } from 'react'
import { useBreakpoint } from './useBreakpoint'

const SWIPE_THRESHOLD = 80
const SNAP_FALLBACK = SWIPE_THRESHOLD + 20

export function useSwipeToDelete({
  enableRightSwipe = false,
  snapLeftRef,
  snapRightRef,
}: {
  enableRightSwipe?: boolean
  snapLeftRef?: { readonly current: HTMLElement | null }
  snapRightRef?: { readonly current: HTMLElement | null }
} = {}) {
  const breakpoint = useBreakpoint()
  const startX = useRef(0)
  const startOffsetX = useRef(0)
  const [offsetX, setOffsetX] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startOffsetX.current = offsetX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - startX.current
    const newOffset = startOffsetX.current + diff
    if (newOffset < 0) {
      setOffsetX(newOffset)
      setSwipeDirection('left')
    } else if (newOffset > 0 && enableRightSwipe) {
      setOffsetX(newOffset)
      setSwipeDirection('right')
    } else {
      setOffsetX(0)
    }
  }

  const handleTouchEnd = () => {
    const snapLeft = snapLeftRef?.current?.offsetWidth || SNAP_FALLBACK
    const snapRight = snapRightRef?.current?.offsetWidth || SNAP_FALLBACK
    if (offsetX < -SWIPE_THRESHOLD) {
      setOffsetX(-snapLeft)
    } else if (offsetX > SWIPE_THRESHOLD) {
      setOffsetX(snapRight)
    } else {
      setOffsetX(0)
    }
  }

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === 'transform' && offsetX === 0) {
      setSwipeDirection(null)
    }
  }

  const isMobile = breakpoint === 'mobile'

  return {
    swipeDirection,
    swipeStyle: isMobile ? { transform: `translateX(${offsetX}px)` } : undefined,
    touchHandlers: isMobile
      ? {
          onTouchStart: handleTouchStart,
          onTouchMove: handleTouchMove,
          onTouchEnd: handleTouchEnd,
          onTransitionEnd: handleTransitionEnd,
        }
      : {},
  }
}
