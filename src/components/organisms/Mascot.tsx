import { useState, useEffect, useRef } from 'react'
import styles from './Mascot.module.css'

type Mood = 'neutral' | 'happy' | 'overwhelmed'

interface MascotProps {
  orderCount: number
  message?: string
}

function getMood(count: number): Mood {
  if (count === 0) return 'neutral'
  if (count <= 4) return 'happy'
  return 'overwhelmed'
}

export function Mascot({ orderCount, message }: MascotProps) {
  const mood = getMood(orderCount)
  const prevMood = useRef(mood)
  const [wobble, setWobble] = useState(false)

  useEffect(() => {
    if (prevMood.current !== mood) {
      setWobble(true)
      prevMood.current = mood
      const timer = setTimeout(() => setWobble(false), 600)
      return () => clearTimeout(timer)
    }
  }, [mood])

  return (
    <div className={styles.mascot}>
      <div className={`${styles.cup} ${wobble ? styles.wobble : ''}`}>
        <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
          {/* Cup body */}
          <path
            d="M8 16H48L44 64H12L8 16Z"
            fill={mood === 'overwhelmed' ? '#E8A0BF' : mood === 'happy' ? '#A8D8B9' : '#D4A574'}
            stroke="#6F4E37"
            strokeWidth="2.5"
          />
          {/* Cup rim */}
          <rect x="4" y="12" width="48" height="8" rx="4" fill="#6F4E37" />
          {/* Handle */}
          <path
            d="M48 24C56 24 60 32 56 40C54 44 50 44 48 40"
            stroke="#6F4E37"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Face - eyes */}
          {mood === 'overwhelmed' ? (
            <>
              <text x="20" y="40" fontSize="12" textAnchor="middle" fill="#6F4E37">x</text>
              <text x="36" y="40" fontSize="12" textAnchor="middle" fill="#6F4E37">x</text>
            </>
          ) : (
            <>
              <circle cx="20" cy="36" r="2.5" fill="#6F4E37" />
              <circle cx="36" cy="36" r="2.5" fill="#6F4E37" />
            </>
          )}
          {/* Mouth */}
          {mood === 'happy' ? (
            <path d="M22 46C26 50 30 50 34 46" stroke="#6F4E37" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : mood === 'overwhelmed' ? (
            <path d="M22 50C26 46 30 46 34 50" stroke="#6F4E37" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : (
            <line x1="22" y1="48" x2="34" y2="48" stroke="#6F4E37" strokeWidth="2" strokeLinecap="round" />
          )}
          {/* Steam */}
          {mood !== 'overwhelmed' && (
            <>
              <path d="M20 8C20 4 24 4 24 0" stroke="#D4A574" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
              <path d="M28 6C28 2 32 2 32 -2" stroke="#D4A574" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
              <path d="M36 8C36 4 40 4 40 0" stroke="#D4A574" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  )
}
