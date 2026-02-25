import type { ReactNode } from 'react'
import styles from './DualPanelLayout.module.css'

interface DualPanelLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
}

export function DualPanelLayout({ header, sidebar, children }: DualPanelLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        {header}
        <div className={styles.sidebarContent}>{sidebar}</div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  )
}
