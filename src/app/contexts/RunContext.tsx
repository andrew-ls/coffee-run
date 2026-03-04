/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useRun } from '@/entities/run'

type RunContextValue = ReturnType<typeof useRun>

const RunContext = createContext<RunContextValue | null>(null)

export function RunProvider({ children }: { children: ReactNode }) {
  const run = useRun()
  return <RunContext.Provider value={run}>{children}</RunContext.Provider>
}

export function useRunContext(): RunContextValue {
  const ctx = useContext(RunContext)
  if (!ctx) throw new Error('useRunContext must be used inside RunProvider')
  return ctx
}
