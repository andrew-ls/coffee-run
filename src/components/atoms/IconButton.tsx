import type { ButtonHTMLAttributes } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'mint' | 'amber'
  label: string
}

export function IconButton({
  variant = 'default',
  label,
  className,
  children,
  ...props
}: IconButtonProps) {
  const cls = [
    styles.iconButton,
    variant === 'primary' && styles.primary,
    variant === 'danger' && styles.danger,
    variant === 'mint' && styles.mint,
    variant === 'amber' && styles.amber,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={cls} aria-label={label} title={label} {...props}>
      {children}
    </button>
  )
}
