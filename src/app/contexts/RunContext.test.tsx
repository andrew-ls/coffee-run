import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { RunProvider, useRunContext } from './RunContext'

const mockStartRun = vi.fn()
const mockArchiveRun = vi.fn()
const mockActiveRun = { id: 'run-1', userId: 'default-user', createdAt: '2024-01-15T12:00:00.000Z', archivedAt: null }

vi.mock('@/entities/run', () => ({
  useRun: vi.fn(() => ({
    activeRun: mockActiveRun,
    startRun: mockStartRun,
    archiveRun: mockArchiveRun,
  })),
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <RunProvider>{children}</RunProvider>
)

describe('RunContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides activeRun from useRun', () => {
    const { result } = renderHook(() => useRunContext(), { wrapper })
    expect(result.current.activeRun).toEqual(mockActiveRun)
  })

  it('provides startRun from useRun', () => {
    const { result } = renderHook(() => useRunContext(), { wrapper })
    expect(result.current.startRun).toBe(mockStartRun)
  })

  it('provides archiveRun from useRun', () => {
    const { result } = renderHook(() => useRunContext(), { wrapper })
    expect(result.current.archiveRun).toBe(mockArchiveRun)
  })

  it('throws when used outside RunProvider', () => {
    expect(() => renderHook(() => useRunContext())).toThrow(
      'useRunContext must be used inside RunProvider',
    )
  })
})
