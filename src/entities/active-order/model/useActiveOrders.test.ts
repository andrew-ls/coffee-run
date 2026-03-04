import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveOrders } from './useActiveOrders'
import { createActiveOrder, createOrderFormData } from '@/test/fixtures'
import type { ActiveOrder } from './active-order'

const RUN_ID = 'run-abc'

describe('useActiveOrders', () => {
  it('returns empty array when runId is null', () => {
    const { result } = renderHook(() => useActiveOrders(null))
    expect(result.current.orders).toHaveLength(0)
  })

  it('returns only orders for the given runId', () => {
    const order1 = createActiveOrder({ id: 'o1', runId: RUN_ID })
    const order2 = createActiveOrder({ id: 'o2', runId: 'other-run' })
    localStorage.setItem('CoffeeRun:orders', JSON.stringify([order1, order2]))

    const { result } = renderHook(() => useActiveOrders(RUN_ID))
    expect(result.current.orders).toHaveLength(1)
    expect(result.current.orders[0].id).toBe('o1')
  })

  it('defaults done to false for existing orders without the field', () => {
    const raw = { id: 'o1', runId: RUN_ID, personName: 'Alice', drinkType: 'Coffee', variant: 'Latte', customVariant: '', iced: false, milkType: 'Oat', milkAmount: 'Splash', sweetenerType: 'None', sweetenerAmount: 0, customDrinkName: '', notes: '', createdAt: '2024-01-15T12:00:00.000Z', updatedAt: '2024-01-15T12:00:00.000Z' }
    localStorage.setItem('CoffeeRun:orders', JSON.stringify([raw]))

    const { result } = renderHook(() => useActiveOrders(RUN_ID))
    expect(result.current.orders[0].done).toBe(false)
  })

  describe('addOrder', () => {
    it('creates an order with done: false, UUID and timestamps', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-06-01T10:00:00.000Z'))

      vi.mocked(crypto.randomUUID).mockReturnValueOnce(
        'new-order-id-0000-0000-0000-000000000000',
      )

      const { result } = renderHook(() => useActiveOrders(RUN_ID))
      const data = createOrderFormData({ personName: 'Bob' })

      act(() => {
        result.current.addOrder(data)
      })

      expect(result.current.orders).toHaveLength(1)
      const order = result.current.orders[0]
      expect(order.id).toBe('new-order-id-0000-0000-0000-000000000000')
      expect(order.runId).toBe(RUN_ID)
      expect(order.personName).toBe('Bob')
      expect(order.done).toBe(false)
      expect(order.createdAt).toBe('2024-06-01T10:00:00.000Z')
      expect(order.updatedAt).toBe('2024-06-01T10:00:00.000Z')

      vi.useRealTimers()
    })

    it('does nothing when runId is null', () => {
      const { result } = renderHook(() => useActiveOrders(null))
      act(() => {
        result.current.addOrder(createOrderFormData())
      })
      expect(result.current.orders).toHaveLength(0)
    })
  })

  describe('updateOrder', () => {
    it('patches the matching order and updates updatedAt', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-06-02T10:00:00.000Z'))

      const order = createActiveOrder({ id: 'o1', runId: RUN_ID, personName: 'Alice' })
      localStorage.setItem('CoffeeRun:orders', JSON.stringify([order]))

      const { result } = renderHook(() => useActiveOrders(RUN_ID))

      act(() => {
        result.current.updateOrder('o1', { personName: 'Bobby' })
      })

      expect(result.current.orders[0].personName).toBe('Bobby')
      expect(result.current.orders[0].updatedAt).toBe('2024-06-02T10:00:00.000Z')

      vi.useRealTimers()
    })
  })

  describe('removeOrder', () => {
    it('removes the matching order', () => {
      const order1 = createActiveOrder({ id: 'o1', runId: RUN_ID })
      const order2 = createActiveOrder({ id: 'o2', runId: RUN_ID })
      localStorage.setItem('CoffeeRun:orders', JSON.stringify([order1, order2]))

      const { result } = renderHook(() => useActiveOrders(RUN_ID))

      act(() => {
        result.current.removeOrder('o1')
      })

      expect(result.current.orders).toHaveLength(1)
      expect(result.current.orders[0].id).toBe('o2')
    })
  })

  describe('toggleDone', () => {
    it('toggles done from false to true', () => {
      const order = createActiveOrder({ id: 'o1', runId: RUN_ID, done: false })
      localStorage.setItem('CoffeeRun:orders', JSON.stringify([order]))

      const { result } = renderHook(() => useActiveOrders(RUN_ID))

      act(() => {
        result.current.toggleDone('o1')
      })

      expect(result.current.orders[0].done).toBe(true)
    })

    it('toggles done from true to false', () => {
      const order = createActiveOrder({ id: 'o1', runId: RUN_ID, done: true })
      localStorage.setItem('CoffeeRun:orders', JSON.stringify([order]))

      const { result } = renderHook(() => useActiveOrders(RUN_ID))

      act(() => {
        result.current.toggleDone('o1')
      })

      expect(result.current.orders[0].done).toBe(false)
    })

    it('does not affect other orders', () => {
      const order1 = createActiveOrder({ id: 'o1', runId: RUN_ID, done: false })
      const order2 = createActiveOrder({ id: 'o2', runId: RUN_ID, done: false })
      localStorage.setItem('CoffeeRun:orders', JSON.stringify([order1, order2]))

      const { result } = renderHook(() => useActiveOrders(RUN_ID))

      act(() => {
        result.current.toggleDone('o1')
      })

      expect(result.current.orders.find((o) => o.id === 'o2')?.done).toBe(false)
    })
  })

  describe('reorderOrders', () => {
    function makeOrders(ids: string[], runId: string): ActiveOrder[] {
      return ids.map((id) => createActiveOrder({ id, runId }))
    }

    it('replaces run orders with the provided reordered array', () => {
      const orders = makeOrders(['A', 'B', 'C'], RUN_ID)
      localStorage.setItem('CoffeeRun:orders', JSON.stringify(orders))

      const { result } = renderHook(() => useActiveOrders(RUN_ID))

      const reordered = [orders[2], orders[0], orders[1]]
      act(() => {
        result.current.reorderOrders(reordered)
      })

      expect(result.current.orders.map((o) => o.id)).toEqual(['C', 'A', 'B'])
    })

    it('does not affect orders from other runs', () => {
      const other = createActiveOrder({ id: 'X', runId: 'other-run' })
      const r1a = createActiveOrder({ id: 'A', runId: RUN_ID })
      const r1b = createActiveOrder({ id: 'B', runId: RUN_ID })
      localStorage.setItem('CoffeeRun:orders', JSON.stringify([other, r1a, r1b]))

      const { result } = renderHook(() => useActiveOrders(RUN_ID))

      const reordered = [result.current.orders[1], result.current.orders[0]]
      act(() => {
        result.current.reorderOrders(reordered)
      })

      expect(result.current.orders.map((o) => o.id)).toEqual(['B', 'A'])

      const allStored = JSON.parse(
        localStorage.getItem('CoffeeRun:orders') ?? '[]',
      ) as ActiveOrder[]
      const otherOrders = allStored.filter((o) => o.runId === 'other-run')
      expect(otherOrders.map((o) => o.id)).toEqual(['X'])
    })

    it('does nothing when runId is null', () => {
      const { result } = renderHook(() => useActiveOrders(null))
      act(() => {
        result.current.reorderOrders([])
      })
      expect(result.current.orders).toHaveLength(0)
    })
  })
})
