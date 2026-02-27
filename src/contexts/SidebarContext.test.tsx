import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { SidebarContext, useSidebarContext } from './SidebarContext'

describe('useSidebarContext', () => {
  it('returns default context values when no provider is present', () => {
    const { result } = renderHook(() => useSidebarContext())
    expect(result.current.sidebarActive).toBe(true)
    expect(result.current.setSidebarActive).toBeInstanceOf(Function)
  })

  it('returns provided context values', () => {
    const setSidebarActive = vi.fn()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SidebarContext.Provider value={{ sidebarActive: false, setSidebarActive }}>
        {children}
      </SidebarContext.Provider>
    )

    const { result } = renderHook(() => useSidebarContext(), { wrapper })
    expect(result.current.sidebarActive).toBe(false)
    expect(result.current.setSidebarActive).toBe(setSidebarActive)
  })
})
