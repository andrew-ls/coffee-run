import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  className?: string
  children: ReactNode
}

export function Card({ className, children }: CardProps) {
  return <div className={[styles.card, className].filter(Boolean).join(' ')}>{children}</div>
}
