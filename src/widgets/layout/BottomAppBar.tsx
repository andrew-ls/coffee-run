import type { ReactNode } from 'react'
import styles from './BottomAppBar.module.css'

interface BottomAppBarProps {
  left?: ReactNode
  right?: ReactNode
}

export function BottomAppBar({ left, right }: BottomAppBarProps) {
  return (
    <div className={styles.bar}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
}

