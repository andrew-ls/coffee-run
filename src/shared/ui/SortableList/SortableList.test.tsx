import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { SortableList } from './SortableList'

// Capture onDragEnd and onDragStart so tests can trigger them manually
let capturedOnDragEnd: ((e: { active: { id: string }; over: { id: string } | null }) => void) | null =
  null
let capturedOnDragStart: ((e: { active: { id: string } }) => void) | null = null

vi.mock('@dnd-kit/core', () => ({
  DndContext: vi.fn(({ children, onDragEnd, onDragStart }: Record<string, unknown>) => {
    capturedOnDragEnd = onDragEnd as typeof capturedOnDragEnd
    capturedOnDragStart = onDragStart as typeof capturedOnDragStart
    return children
  }),
  DragOverlay: vi.fn(({ children }: Record<string, unknown>) => children),
  PointerSensor: class {},
  TouchSensor: class {},
  closestCenter: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => children,
  useSortable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
  verticalListSortingStrategy: vi.fn(),
}))

vi.mock('@dnd-kit/modifiers', () => ({
  restrictToVerticalAxis: vi.fn(),
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: vi.fn(() => undefined) } },
}))

// React must be imported after the vi.mock calls so JSX works in the mock factories
import React from 'react'

describe('SortableList', () => {
  const items = [
    { id: 'item-1' },
    { id: 'item-2' },
    { id: 'item-3' },
  ]

  beforeEach(() => {
    capturedOnDragEnd = null
    capturedOnDragStart = null
  })

  it('renders all items', () => {
    render(
      <SortableList
        items={items}
        onReorder={vi.fn()}
        renderItem={(item) => <div>{item.id}</div>}
        renderOverlay={(item) => <div>{item.id}</div>}
      />,
    )
    expect(screen.getByText('item-1')).toBeInTheDocument()
    expect(screen.getByText('item-2')).toBeInTheDocument()
    expect(screen.getByText('item-3')).toBeInTheDocument()
  })

  it('calls onReorder with correct indices when items are dragged to new positions', () => {
    const onReorder = vi.fn()
    render(
      <SortableList
        items={items}
        onReorder={onReorder}
        renderItem={(item) => <div>{item.id}</div>}
        renderOverlay={(item) => <div>{item.id}</div>}
      />,
    )

    act(() => {
      capturedOnDragEnd?.({ active: { id: 'item-1' }, over: { id: 'item-3' } })
    })

    expect(onReorder).toHaveBeenCalledWith(0, 2)
  })

  it('does not call onReorder when active and over IDs are the same', () => {
    const onReorder = vi.fn()
    render(
      <SortableList
        items={items}
        onReorder={onReorder}
        renderItem={(item) => <div>{item.id}</div>}
        renderOverlay={(item) => <div>{item.id}</div>}
      />,
    )

    act(() => {
      capturedOnDragEnd?.({ active: { id: 'item-1' }, over: { id: 'item-1' } })
    })

    expect(onReorder).not.toHaveBeenCalled()
  })

  it('does not call onReorder when over is null', () => {
    const onReorder = vi.fn()
    render(
      <SortableList
        items={items}
        onReorder={onReorder}
        renderItem={(item) => <div>{item.id}</div>}
        renderOverlay={(item) => <div>{item.id}</div>}
      />,
    )

    act(() => {
      capturedOnDragEnd?.({ active: { id: 'item-1' }, over: null })
    })

    expect(onReorder).not.toHaveBeenCalled()
  })

  it('does not call onReorder when dragged IDs are not found in items', () => {
    const onReorder = vi.fn()
    render(
      <SortableList
        items={items}
        onReorder={onReorder}
        renderItem={(item) => <div>{item.id}</div>}
        renderOverlay={(item) => <div>{item.id}</div>}
      />,
    )

    act(() => {
      capturedOnDragEnd?.({ active: { id: 'nonexistent' }, over: { id: 'item-3' } })
    })

    expect(onReorder).not.toHaveBeenCalled()
  })

  it('passes dragHandleProps and isDragging to renderItem', () => {
    const renderItem = vi.fn(() => <div>item</div>)
    render(
      <SortableList
        items={[{ id: 'x' }]}
        onReorder={vi.fn()}
        renderItem={renderItem}
        renderOverlay={() => <div />}
      />,
    )
    expect(renderItem).toHaveBeenCalledWith(
      { id: 'x' },
      expect.objectContaining({ dragHandleProps: expect.any(Object), isDragging: false }),
    )
  })

  it('calls renderOverlay for the active item when drag starts', () => {
    const renderOverlay = vi.fn((item: { id: string }) => <div data-testid="overlay">{item.id}</div>)
    render(
      <SortableList
        items={items}
        onReorder={vi.fn()}
        renderItem={(item) => <div>{item.id}</div>}
        renderOverlay={renderOverlay}
      />,
    )

    act(() => {
      capturedOnDragStart?.({ active: { id: 'item-1' } })
    })

    expect(renderOverlay).toHaveBeenCalledWith(items[0])
    expect(screen.getByTestId('overlay')).toBeInTheDocument()
  })
})
