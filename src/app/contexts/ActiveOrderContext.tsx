/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useActiveOrders } from '@/entities/active-order'
import { useRunContext } from './RunContext'

type ActiveOrderContextValue = ReturnType<typeof useActiveOrders>

const ActiveOrderContext = createContext<ActiveOrderContextValue | null>(null)

export function ActiveOrderProvider({ children }: { children: ReactNode }) {
  const { activeRun } = useRunContext()
  const orders = useActiveOrders(activeRun?.id ?? null)
  return <ActiveOrderContext.Provider value={orders}>{children}</ActiveOrderContext.Provider>
}

export function useActiveOrderContext(): ActiveOrderContextValue {
  const ctx = useContext(ActiveOrderContext)
  if (!ctx) throw new Error('useActiveOrderContext must be used inside ActiveOrderProvider')
  return ctx
}
