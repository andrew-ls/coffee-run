/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useSavedOrders } from '@/entities/saved-order'

type SavedOrderContextValue = ReturnType<typeof useSavedOrders>

const SavedOrderContext = createContext<SavedOrderContextValue | null>(null)

export function SavedOrderProvider({ children }: { children: ReactNode }) {
  const saved = useSavedOrders()
  return <SavedOrderContext.Provider value={saved}>{children}</SavedOrderContext.Provider>
}

export function useSavedOrderContext(): SavedOrderContextValue {
  const ctx = useContext(SavedOrderContext)
  if (!ctx) throw new Error('useSavedOrderContext must be used inside SavedOrderProvider')
  return ctx
}
