import type { ReactNode } from 'react'
import styles from './SinglePanelLayout.module.css'

interface SinglePanelLayoutProps {
  header: ReactNode
  children: ReactNode
}

export function SinglePanelLayout({ header, children }: SinglePanelLayoutProps) {
  return (
    <div className={styles.layout}>
      {header}
      <main className={styles.content}>{children}</main>
    </div>
  )
}
