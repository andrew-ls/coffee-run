import type React from 'react'

export interface Action {
  name: string
  label: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  color: 'default' | 'primary' | 'danger' | 'mint' | 'amber'
  destructive: boolean
  callback: () => void
}
