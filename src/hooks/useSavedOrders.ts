import { useCallback, useMemo } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
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

  const reorderSavedOrders = useCallback(
    (fromIndex: number, toIndex: number) => {
      setAllSaved((prev) => {
        const userIndices = prev.reduce<number[]>((acc, s, i) => {
          if (s.userId === userId) acc.push(i)
          return acc
        }, [])
        const reorderedIndices = arrayMove(userIndices, fromIndex, toIndex)
        const next = [...prev]
        reorderedIndices.forEach((globalIdx, slot) => {
          next[userIndices[slot]] = prev[globalIdx]
        })
        return next
      })
    },
    [userId, setAllSaved],
  )

  return { savedOrders, saveOrder, removeSavedOrder, reorderSavedOrders }
}
