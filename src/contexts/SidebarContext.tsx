import { createContext, useContext } from 'react'

interface SidebarContextValue {
  sidebarActive: boolean
  setSidebarActive: (active: boolean) => void
}

export const SidebarContext = createContext<SidebarContextValue>({
  sidebarActive: true,
  setSidebarActive: () => {},
})

export function useSidebarContext() {
  return useContext(SidebarContext)
}
