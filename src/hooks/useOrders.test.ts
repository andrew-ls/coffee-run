import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOrders } from './useOrders'
import { createOrder, createOrderFormData } from '@/test/fixtures'
import type { Order } from '@/types'

const RUN_ID = 'run-abc'

describe('useOrders', () => {
  it('returns empty array when runId is null', () => {
    const { result } = renderHook(() => useOrders(null))
    expect(result.current.orders).toHaveLength(0)
  })

  it('returns only orders for the given runId', () => {
    const order1 = createOrder({ id: 'o1', runId: RUN_ID })
    const order2 = createOrder({ id: 'o2', runId: 'other-run' })
    localStorage.setItem('CoffeeRun:orders', JSON.stringify([order1, order2]))

    const { result } = renderHook(() => useOrders(RUN_ID))
    expect(result.current.orders).toHaveLength(1)
    expect(result.current.orders[0].id).toBe('o1')
  })

  it('returns empty array when runId does not match any orders', () => {
    const order = createOrder({ id: 'o1', runId: 'other-run' })
    localStorage.setItem('CoffeeRun:orders', JSON.stringify([order]))

    const { result } = renderHook(() => useOrders(RUN_ID))
    expect(result.current.orders).toHaveLength(0)
  })

  describe('addOrder', () => {
    it('creates an order with a UUID and timestamps', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-06-01T10:00:00.000Z'))

      vi.mocked(crypto.randomUUID).mockReturnValueOnce(
        'new-order-id-0000-0000-0000-000000000000',
      )

      const { result } = renderHook(() => useOrders(RUN_ID))
      const data = createOrderFormData({ personName: 'Bob' })

      act(() => {
        result.current.addOrder(data)
      })

      expect(result.current.orders).toHaveLength(1)
      const order = result.current.orders[0]
      expect(order.id).toBe('new-order-id-0000-0000-0000-000000000000')
      expect(order.runId).toBe(RUN_ID)
      expect(order.personName).toBe('Bob')
      expect(order.createdAt).toBe('2024-06-01T10:00:00.000Z')
      expect(order.updatedAt).toBe('2024-06-01T10:00:00.000Z')

      vi.useRealTimers()
    })

    it('does nothing when runId is null', () => {
      const { result } = renderHook(() => useOrders(null))
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

      const order = createOrder({ id: 'o1', runId: RUN_ID, personName: 'Alice' })
      localStorage.setItem('CoffeeRun:orders', JSON.stringify([order]))

      const { result } = renderHook(() => useOrders(RUN_ID))

      act(() => {
        result.current.updateOrder('o1', { personName: 'Bobby' })
      })

      expect(result.current.orders[0].personName).toBe('Bobby')
      expect(result.current.orders[0].updatedAt).toBe('2024-06-02T10:00:00.000Z')

      vi.useRealTimers()
    })

    it('does not change other orders', () => {
      const order1 = createOrder({ id: 'o1', runId: RUN_ID, personName: 'Alice' })
      const order2 = createOrder({ id: 'o2', runId: RUN_ID, personName: 'Bob' })
      localStorage.setItem('CoffeeRun:orders', JSON.stringify([order1, order2]))

      const { result } = renderHook(() => useOrders(RUN_ID))

      act(() => {
        result.current.updateOrder('o1', { personName: 'Alice Updated' })
      })

      expect(result.current.orders.find((o) => o.id === 'o2')?.personName).toBe('Bob')
    })
  })

  describe('removeOrder', () => {
    it('removes the matching order', () => {
      const order1 = createOrder({ id: 'o1', runId: RUN_ID })
      const order2 = createOrder({ id: 'o2', runId: RUN_ID })
      localStorage.setItem('CoffeeRun:orders', JSON.stringify([order1, order2]))

      const { result } = renderHook(() => useOrders(RUN_ID))

      act(() => {
        result.current.removeOrder('o1')
      })

      expect(result.current.orders).toHaveLength(1)
      expect(result.current.orders[0].id).toBe('o2')
    })
  })

  describe('reorderOrders', () => {
    function makeOrders(ids: string[], runId: string): Order[] {
      return ids.map((id) => createOrder({ id, runId }))
    }

    it('moves first item to last: [A,B,C] from=0 to=2 → [B,C,A]', () => {
      const orders = makeOrders(['A', 'B', 'C'], RUN_ID)
      localStorage.setItem('CoffeeRun:orders', JSON.stringify(orders))

      const { result } = renderHook(() => useOrders(RUN_ID))

      act(() => {
        result.current.reorderOrders(0, 2)
      })

      expect(result.current.orders.map((o) => o.id)).toEqual(['B', 'C', 'A'])
    })

    it('moves last item to first: [A,B,C] from=2 to=0 → [C,A,B]', () => {
      const orders = makeOrders(['A', 'B', 'C'], RUN_ID)
      localStorage.setItem('CoffeeRun:orders', JSON.stringify(orders))

      const { result } = renderHook(() => useOrders(RUN_ID))

      act(() => {
        result.current.reorderOrders(2, 0)
      })

      expect(result.current.orders.map((o) => o.id)).toEqual(['C', 'A', 'B'])
    })

    it('does not affect orders from other runs', () => {
      const other1 = createOrder({ id: 'X', runId: 'other-run' })
      const r1a = createOrder({ id: 'A', runId: RUN_ID })
      const other2 = createOrder({ id: 'Y', runId: 'other-run' })
      const r1b = createOrder({ id: 'B', runId: RUN_ID })
      const r1c = createOrder({ id: 'C', runId: RUN_ID })
      localStorage.setItem(
        'CoffeeRun:orders',
        JSON.stringify([other1, r1a, other2, r1b, r1c]),
      )

      const { result } = renderHook(() => useOrders(RUN_ID))

      act(() => {
        result.current.reorderOrders(0, 2)
      })

      // run-1 orders reordered
      expect(result.current.orders.map((o) => o.id)).toEqual(['B', 'C', 'A'])

      // other-run orders still there in storage
      const allStored = JSON.parse(localStorage.getItem('CoffeeRun:orders') ?? '[]') as Order[]
      const otherOrders = allStored.filter((o) => o.runId === 'other-run')
      expect(otherOrders.map((o) => o.id)).toEqual(['X', 'Y'])
    })

    it('does nothing when runId is null', () => {
      const { result } = renderHook(() => useOrders(null))
      act(() => {
        result.current.reorderOrders(0, 1)
      })
      expect(result.current.orders).toHaveLength(0)
    })
  })
})
