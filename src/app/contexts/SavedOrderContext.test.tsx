import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { SavedOrderProvider, useSavedOrderContext } from './SavedOrderContext'

const mockSavedOrders = [{ id: 's1', orderData: { personName: 'Bob' } }]
const mockSaveOrder = vi.fn()

vi.mock('@/entities/saved-order', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/saved-order')>()
  return {
    ...actual,
    useSavedOrders: vi.fn(() => ({
      savedOrders: mockSavedOrders,
      saveOrder: mockSaveOrder,
      removeSavedOrder: vi.fn(),
      reorderSavedOrders: vi.fn(),
    })),
  }
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <SavedOrderProvider>{children}</SavedOrderProvider>
)

describe('SavedOrderContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides savedOrders from useSavedOrders', () => {
    const { result } = renderHook(() => useSavedOrderContext(), { wrapper })
    expect(result.current.savedOrders).toEqual(mockSavedOrders)
  })

  it('provides saveOrder from useSavedOrders', () => {
    const { result } = renderHook(() => useSavedOrderContext(), { wrapper })
    expect(result.current.saveOrder).toBe(mockSaveOrder)
  })

  it('throws when used outside SavedOrderProvider', () => {
    expect(() => renderHook(() => useSavedOrderContext())).toThrow(
      'useSavedOrderContext must be used inside SavedOrderProvider',
    )
  })
})
