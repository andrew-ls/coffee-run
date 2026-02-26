import { ASPECT_COLORS } from '@/config'
import type { AspectCategory } from '@/config'
import styles from './pill.module.css'

interface AspectPillProps {
  label: string
  category: AspectCategory
  className?: string
}

export function AspectPill({ label, category, className }: AspectPillProps) {
  const { background, text } = ASPECT_COLORS[category]
  return (
    <span
      className={`${styles.pill} ${className ?? ''}`}
      style={{ backgroundColor: background, color: text }}
    >
      {label}
    </span>
  )
}
