import { useState, useEffect } from 'react'

type Breakpoint = 'mobile' | 'desktop'

const DESKTOP_QUERY = '(min-width: 768px)'

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    window.matchMedia(DESKTOP_QUERY).matches ? 'desktop' : 'mobile',
  )

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const handler = (e: MediaQueryListEvent) => {
      setBreakpoint(e.matches ? 'desktop' : 'mobile')
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return breakpoint
}
