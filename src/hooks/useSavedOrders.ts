import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useUserId } from './useUserId'
import { generateId, now } from '@/utils'
import type { SavedOrder, OrderFormData } from '@/types'

const STORAGE_KEY = 'CoffeeRun:savedOrders'

export function useSavedOrders() {
  const userId = useUserId()
  const [allSaved, setAllSaved] = useLocalStorage<SavedOrder[]>(STORAGE_KEY, [])

  const savedOrders = useMemo(
    () => allSaved.filter((s) => s.userId === userId),
    [allSaved, userId],
  )

  const saveOrder = useCallback(
    (data: OrderFormData) => {
      const saved: SavedOrder = {
        id: generateId(),
        userId,
        orderData: data,
        createdAt: now(),
        updatedAt: now(),
      }
      setAllSaved((prev) => [...prev, saved])
      return saved
    },
    [userId, setAllSaved],
  )

  const removeSavedOrder = useCallback(
    (savedId: string) => {
      setAllSaved((prev) => prev.filter((s) => s.id !== savedId))
    },
    [setAllSaved],
  )

  return { savedOrders, saveOrder, removeSavedOrder }
}
