import { DRINKS } from '@/config'
import styles from './pill.module.css'

const FALLBACK_COLOR = DRINKS.find((d) => d.type === 'Other')!.pillColor

interface BadgeProps {
  drinkType: string
  className?: string
}

export function Badge({ drinkType, className }: BadgeProps) {
  const { background, text } = DRINKS.find((d) => d.type === drinkType)?.pillColor ?? FALLBACK_COLOR
  return (
    <span
      className={`${styles.pill} ${className ?? ''}`}
      style={{ backgroundColor: background, color: text }}
    >
      {drinkType}
    </span>
  )
}
