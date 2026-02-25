import type { ButtonHTMLAttributes } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger'
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
    variant === 'danger' && styles.danger,
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
