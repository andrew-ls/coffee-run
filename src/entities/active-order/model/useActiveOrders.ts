import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { generateId, now } from '@/shared/utils'
import type { OrderFormData } from '@/shared/types'
import type { ActiveOrder } from './active-order'

const STORAGE_KEY = 'CoffeeRun:orders'

export function useActiveOrders(runId: string | null) {
  const [allOrders, setAllOrders] = useLocalStorage<ActiveOrder[]>(STORAGE_KEY, [])

  const orders = useMemo(
    () =>
      runId
        ? allOrders
            .filter((o) => o.runId === runId)
            .map((o) => ({ ...o, done: o.done ?? false }))
        : [],
    [allOrders, runId],
  )

  const addOrder = useCallback(
    (data: OrderFormData) => {
      if (!runId) return
      const order: ActiveOrder = {
        ...data,
        id: generateId(),
        runId,
        done: false,
        createdAt: now(),
        updatedAt: now(),
      }
      setAllOrders((prev) => [...prev, order])
      return order
    },
    [runId, setAllOrders],
  )

  const updateOrder = useCallback(
    (orderId: string, data: Partial<OrderFormData>) => {
      setAllOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, ...data, updatedAt: now() } : o,
        ),
      )
    },
    [setAllOrders],
  )

  const removeOrder = useCallback(
    (orderId: string) => {
      setAllOrders((prev) => prev.filter((o) => o.id !== orderId))
    },
    [setAllOrders],
  )

  const toggleDone = useCallback(
    (orderId: string) => {
      setAllOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, done: !o.done, updatedAt: now() } : o,
        ),
      )
    },
    [setAllOrders],
  )

  const reorderOrders = useCallback(
    (reordered: ActiveOrder[]) => {
      if (!runId) return
      setAllOrders((prev) => {
        const others = prev.filter((o) => o.runId !== runId)
        return [...others, ...reordered]
      })
    },
    [runId, setAllOrders],
  )

  return { orders, addOrder, updateOrder, removeOrder, toggleDone, reorderOrders }
}
