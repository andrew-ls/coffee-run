import { useCallback, useMemo } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { useLocalStorage } from './useLocalStorage'
import { generateId, now } from '@/utils'
import type { Order, OrderFormData } from '@/types'

const STORAGE_KEY = 'CoffeeRun:orders'

export function useOrders(runId: string | null) {
  const [allOrders, setAllOrders] = useLocalStorage<Order[]>(STORAGE_KEY, [])

  const orders = useMemo(
    () => (runId ? allOrders.filter((o) => o.runId === runId) : []),
    [allOrders, runId],
  )

  const addOrder = useCallback(
    (data: OrderFormData) => {
      if (!runId) return
      const order: Order = {
        ...data,
        id: generateId(),
        runId,
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

  const reorderOrders = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (!runId) return
      setAllOrders((prev) => {
        const runIndices = prev.reduce<number[]>((acc, o, i) => {
          if (o.runId === runId) acc.push(i)
          return acc
        }, [])
        const reorderedIndices = arrayMove(runIndices, fromIndex, toIndex)
        const next = [...prev]
        reorderedIndices.forEach((globalIdx, slot) => {
          next[runIndices[slot]] = prev[globalIdx]
        })
        return next
      })
    },
    [runId, setAllOrders],
  )

  return { orders, addOrder, updateOrder, removeOrder, reorderOrders }
}
