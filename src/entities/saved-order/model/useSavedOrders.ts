import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { useUserId } from '@/shared/hooks/useUserId'
import { generateId, now } from '@/shared/utils'
import type { OrderFormData } from '@/shared/types'
import type { SavedOrder } from './saved-order'

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

  const reorderSavedOrders = useCallback(
    (reordered: SavedOrder[]) => {
      setAllSaved((prev) => {
        const others = prev.filter((s) => s.userId !== userId)
        return [...others, ...reordered]
      })
    },
    [userId, setAllSaved],
  )

  return { savedOrders, saveOrder, removeSavedOrder, reorderSavedOrders }
}
