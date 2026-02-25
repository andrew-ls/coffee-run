import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSavedOrders } from './useSavedOrders'
import { createSavedOrder, createOrderFormData } from '@/test/fixtures'
import type { SavedOrder } from '@/types'

describe('useSavedOrders', () => {
  it('returns empty array when storage is empty', () => {
    const { result } = renderHook(() => useSavedOrders())
    expect(result.current.savedOrders).toHaveLength(0)
  })

  it('filters by userId', () => {
    const mine = createSavedOrder({ id: 's1', userId: 'default-user' })
    const theirs = createSavedOrder({ id: 's2', userId: 'other-user' })
    localStorage.setItem('CoffeeRun:savedOrders', JSON.stringify([mine, theirs]))

    const { result } = renderHook(() => useSavedOrders())
    expect(result.current.savedOrders).toHaveLength(1)
    expect(result.current.savedOrders[0].id).toBe('s1')
  })

  describe('saveOrder', () => {
    it('wraps data in a SavedOrder with correct shape', () => {
      const { result } = renderHook(() => useSavedOrders())
      const data = createOrderFormData({ personName: 'Carol' })

      act(() => {
        result.current.saveOrder(data)
      })

      expect(result.current.savedOrders).toHaveLength(1)
      const saved = result.current.savedOrders[0]
      expect(saved.userId).toBe('default-user')
      expect(saved.orderData.personName).toBe('Carol')
      expect(saved.id).toBeTruthy()
    })
  })

  describe('removeSavedOrder', () => {
    it('removes the matching saved order', () => {
      const saved = createSavedOrder({ id: 's1' })
      localStorage.setItem('CoffeeRun:savedOrders', JSON.stringify([saved]))

      const { result } = renderHook(() => useSavedOrders())

      act(() => {
        result.current.removeSavedOrder('s1')
      })

      expect(result.current.savedOrders).toHaveLength(0)
    })
  })

  describe('reorderSavedOrders', () => {
    it('moves first item to last: [A,B,C] from=0 to=2 → [B,C,A]', () => {
      const saved = ['A', 'B', 'C'].map((id) =>
        createSavedOrder({ id, userId: 'default-user' }),
      )
      localStorage.setItem('CoffeeRun:savedOrders', JSON.stringify(saved))

      const { result } = renderHook(() => useSavedOrders())

      act(() => {
        result.current.reorderSavedOrders(0, 2)
      })

      expect(result.current.savedOrders.map((s) => s.id)).toEqual(['B', 'C', 'A'])
    })

    it('does not affect other users orders', () => {
      const mine1 = createSavedOrder({ id: 'M1', userId: 'default-user' })
      const theirs = createSavedOrder({ id: 'T1', userId: 'other-user' })
      const mine2 = createSavedOrder({ id: 'M2', userId: 'default-user' })
      localStorage.setItem('CoffeeRun:savedOrders', JSON.stringify([mine1, theirs, mine2]))

      const { result } = renderHook(() => useSavedOrders())

      act(() => {
        result.current.reorderSavedOrders(0, 1)
      })

      expect(result.current.savedOrders.map((s) => s.id)).toEqual(['M2', 'M1'])

      const all = JSON.parse(
        localStorage.getItem('CoffeeRun:savedOrders') ?? '[]',
      ) as SavedOrder[]
      const theirs2 = all.find((s) => s.userId === 'other-user')
      expect(theirs2?.id).toBe('T1')
    })
  })
})
