import type { PillColor } from '@/config'
import styles from './Pill.module.css'

interface PillProps {
  label: string
  color: PillColor
  className?: string
}

export function Pill({ label, color, className }: PillProps) {
  return (
    <span
      className={`${styles.pill} ${className ?? ''}`}
      style={{ backgroundColor: color.background, color: color.text }}
    >
      {label}
    </span>
  )
}
