import type { ReactNode } from 'react'
import styles from './DualPanelLayout.module.css'

interface DualPanelLayoutProps {
  sidebarActive: boolean
  header: ReactNode
  sidebar: ReactNode
  sidebarBottom?: ReactNode
  children: ReactNode
  mainBottom?: ReactNode
}

export function DualPanelLayout({ sidebarActive, header, sidebar, sidebarBottom, children, mainBottom }: DualPanelLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={`${styles.sidebar} ${!sidebarActive ? styles.sidebarHidden : ''}`}>
        {header}
        <div className={styles.sidebarContent}>{sidebar}</div>
        {sidebarBottom}
      </div>
      <div className={`${styles.main} ${sidebarActive ? styles.mainHidden : ''}`}>
        <div className={styles.mainContent}>{children}</div>
        {mainBottom}
      </div>
    </div>
  )
}
