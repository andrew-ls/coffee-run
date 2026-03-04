import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useConfirmation } from './useConfirmation'

describe('useConfirmation', () => {
  it('starts with no pending id', () => {
    const { result } = renderHook(() => useConfirmation(vi.fn()))
    expect(result.current.pendingId).toBeNull()
  })

  it('sets pendingId when request is called', () => {
    const { result } = renderHook(() => useConfirmation(vi.fn()))
    act(() => {
      result.current.request('some-id')
    })
    expect(result.current.pendingId).toBe('some-id')
  })

  it('calls onConfirm with the pending id and clears it when confirm is called', () => {
    const onConfirm = vi.fn()
    const { result } = renderHook(() => useConfirmation(onConfirm))
    act(() => {
      result.current.request('delete-id')
    })
    act(() => {
      result.current.confirm()
    })
    expect(onConfirm).toHaveBeenCalledWith('delete-id')
    expect(result.current.pendingId).toBeNull()
  })

  it('does nothing when confirm is called with no pending id', () => {
    const onConfirm = vi.fn()
    const { result } = renderHook(() => useConfirmation(onConfirm))
    act(() => {
      result.current.confirm()
    })
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('clears pendingId without calling onConfirm when cancel is called', () => {
    const onConfirm = vi.fn()
    const { result } = renderHook(() => useConfirmation(onConfirm))
    act(() => {
      result.current.request('cancel-id')
    })
    act(() => {
      result.current.cancel()
    })
    expect(onConfirm).not.toHaveBeenCalled()
    expect(result.current.pendingId).toBeNull()
  })
})
