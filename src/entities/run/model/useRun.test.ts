import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRun } from './useRun'
import { createRun } from '@/test/fixtures'

describe('useRun', () => {
  it('activeRun is null when storage is empty', () => {
    const { result } = renderHook(() => useRun())
    expect(result.current.activeRun).toBeNull()
  })

  it('activeRun is null when all runs are archived', () => {
    const archived = createRun({ archivedAt: '2024-01-10T00:00:00.000Z' })
    localStorage.setItem('CoffeeRun:runs', JSON.stringify([archived]))

    const { result } = renderHook(() => useRun())
    expect(result.current.activeRun).toBeNull()
  })

  it('activeRun returns the non-archived run', () => {
    const active = createRun({ id: 'active-run' })
    const archived = createRun({ id: 'archived-run', archivedAt: '2024-01-10T00:00:00.000Z' })
    localStorage.setItem('CoffeeRun:runs', JSON.stringify([archived, active]))

    const { result } = renderHook(() => useRun())
    expect(result.current.activeRun?.id).toBe('active-run')
  })

  it('startRun creates a new run with correct shape', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-01T10:00:00.000Z'))

    const { result } = renderHook(() => useRun())

    let newRun: ReturnType<typeof result.current.startRun>
    act(() => {
      newRun = result.current.startRun()
    })

    expect(newRun!.userId).toBe('default-user')
    expect(newRun!.archivedAt).toBeNull()
    expect(newRun!.createdAt).toBe('2024-06-01T10:00:00.000Z')

    vi.useRealTimers()
  })

  it('startRun sets the new run as active', () => {
    const { result } = renderHook(() => useRun())

    act(() => {
      result.current.startRun()
    })

    expect(result.current.activeRun).not.toBeNull()
    expect(result.current.activeRun?.archivedAt).toBeNull()
  })

  it('archiveRun sets archivedAt on the matching run', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-02T10:00:00.000Z'))

    const { result } = renderHook(() => useRun())

    act(() => {
      result.current.startRun()
    })

    const runId = result.current.activeRun!.id

    act(() => {
      result.current.archiveRun(runId)
    })

    expect(result.current.activeRun).toBeNull()

    const stored = JSON.parse(localStorage.getItem('CoffeeRun:runs') ?? '[]') as Array<{
      id: string
      archivedAt: string | null
    }>
    const archived = stored.find((r) => r.id === runId)
    expect(archived?.archivedAt).toBe('2024-06-02T10:00:00.000Z')

    vi.useRealTimers()
  })

  it('archiveRun leaves other runs untouched', () => {
    const run1 = createRun({ id: 'run-1' })
    const run2 = createRun({ id: 'run-2' })
    localStorage.setItem('CoffeeRun:runs', JSON.stringify([run1, run2]))

    const { result } = renderHook(() => useRun())

    act(() => {
      result.current.archiveRun('run-1')
    })

    const stored = JSON.parse(localStorage.getItem('CoffeeRun:runs') ?? '[]') as Array<{
      id: string
      archivedAt: string | null
    }>
    const untouched = stored.find((r) => r.id === 'run-2')
    expect(untouched?.archivedAt).toBeNull()
  })
})
