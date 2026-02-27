import type { ReactNode } from 'react'
import styles from './BottomAppBar.module.css'

interface BottomAppBarProps {
  left?: ReactNode
  right?: ReactNode
  sidebarOffset?: boolean
}

export function BottomAppBar({ left, right, sidebarOffset = false }: BottomAppBarProps) {
  return (
    <div className={`${styles.bar} ${sidebarOffset ? styles.sidebarOffset : ''}`}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
}

interface FabProps {
  onClick: () => void
  label: string
}

export function Fab({ onClick, label }: FabProps) {
  return (
    <button className={styles.fab} onClick={onClick} aria-label={label}>
      +
    </button>
  )
}
