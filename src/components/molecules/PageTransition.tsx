import { useState, useLayoutEffect, useEffect, useRef, type ReactNode } from 'react'
import styles from './PageTransition.module.css'

type Direction = 'forward' | 'back'

interface PageTransitionProps {
  contentKey: string
  direction: Direction
  children: ReactNode
}

export function PageTransition({ contentKey, direction, children }: PageTransitionProps) {
  const [exitingContent, setExitingContent] = useState<ReactNode>(null)
  const [exitDirection, setExitDirection] = useState<Direction>('forward')
  const prevChildrenRef = useRef<ReactNode>(children)
  const prevKeyRef = useRef(contentKey)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Runs after every render to detect key changes and snapshot outgoing content
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (prevKeyRef.current !== contentKey) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setExitingContent(prevChildrenRef.current)
      setExitDirection(direction)
      prevKeyRef.current = contentKey
      timerRef.current = setTimeout(() => {
        setExitingContent(null)
        timerRef.current = null
      }, 250)
    }
    prevChildrenRef.current = children
  })

  const enterClass = direction === 'forward' ? styles.enterForward : styles.enterBack
  const exitClass = exitDirection === 'forward' ? styles.exitForward : styles.exitBack

  return (
    <div className={styles.container}>
      {exitingContent !== null && (
        <div className={`${styles.page} ${exitClass}`}>{exitingContent}</div>
      )}
      <div className={`${styles.page} ${exitingContent !== null ? enterClass : ''}`}>
        {children}
      </div>
    </div>
  )
}
