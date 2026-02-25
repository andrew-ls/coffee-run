import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useUserId } from './useUserId'
import { generateId, now } from '@/utils'
import type { Run } from '@/types'

const STORAGE_KEY = 'CoffeeRun:runs'

export function useRun() {
  const userId = useUserId()
  const [runs, setRuns] = useLocalStorage<Run[]>(STORAGE_KEY, [])

  const activeRun = useMemo(
    () => runs.find((r) => r.userId === userId && r.archivedAt === null) ?? null,
    [runs, userId],
  )

  const startRun = useCallback(() => {
    const run: Run = {
      id: generateId(),
      userId,
      createdAt: now(),
      archivedAt: null,
    }
    setRuns((prev) => [...prev, run])
    return run
  }, [userId, setRuns])

  const archiveRun = useCallback(
    (runId: string) => {
      setRuns((prev) =>
        prev.map((r) => (r.id === runId ? { ...r, archivedAt: now() } : r)),
      )
    },
    [setRuns],
  )

  return { activeRun, startRun, archiveRun }
}
