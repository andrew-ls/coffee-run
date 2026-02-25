import styles from './Badge.module.css'

const VARIANT_MAP: Record<string, string> = {
  Coffee: styles.coffee,
  Tea: styles.tea,
  'Hot Chocolate': styles.hotChocolate,
  Juice: styles.juice,
}

interface BadgeProps {
  drinkType: string
  className?: string
}

export function Badge({ drinkType, className }: BadgeProps) {
  const variantCls = VARIANT_MAP[drinkType] ?? styles.other
  return (
    <span className={`${styles.badge} ${variantCls} ${className ?? ''}`}>
      {drinkType}
    </span>
  )
}
