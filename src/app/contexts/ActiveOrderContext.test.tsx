import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ActiveOrderProvider, useActiveOrderContext } from './ActiveOrderContext'

const mockOrders = [{ id: 'o1', personName: 'Alice' }]
const mockAddOrder = vi.fn()

vi.mock('./RunContext', () => ({
  useRunContext: vi.fn(() => ({ activeRun: { id: 'run-1' } })),
}))

vi.mock('@/entities/active-order', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/active-order')>()
  return {
    ...actual,
    useActiveOrders: vi.fn(() => ({
      orders: mockOrders,
      addOrder: mockAddOrder,
      updateOrder: vi.fn(),
      removeOrder: vi.fn(),
      toggleDone: vi.fn(),
      reorderOrders: vi.fn(),
    })),
  }
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <ActiveOrderProvider>{children}</ActiveOrderProvider>
)

describe('ActiveOrderContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides orders from useActiveOrders', () => {
    const { result } = renderHook(() => useActiveOrderContext(), { wrapper })
    expect(result.current.orders).toEqual(mockOrders)
  })

  it('provides addOrder from useActiveOrders', () => {
    const { result } = renderHook(() => useActiveOrderContext(), { wrapper })
    expect(result.current.addOrder).toBe(mockAddOrder)
  })

  it('throws when used outside ActiveOrderProvider', () => {
    expect(() => renderHook(() => useActiveOrderContext())).toThrow(
      'useActiveOrderContext must be used inside ActiveOrderProvider',
    )
  })
})
