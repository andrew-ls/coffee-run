import type { ReactNode } from 'react'
import { useSidebarContext } from '@/contexts/SidebarContext'
import styles from './DualPanelLayout.module.css'

interface DualPanelLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  sidebarBottom?: ReactNode
  children: ReactNode
  mainBottom?: ReactNode
}

export function DualPanelLayout({ header, sidebar, sidebarBottom, children, mainBottom }: DualPanelLayoutProps) {
  const { sidebarActive } = useSidebarContext()
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
