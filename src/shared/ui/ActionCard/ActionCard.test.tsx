import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ActionCard } from './ActionCard'
import type { Action } from './Action'
import { CheckIcon } from '@/shared/assets/icons'
import { DeleteIcon } from '@/shared/assets/icons'

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => children,
  DragOverlay: () => null,
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

vi.mock('@dnd-kit/modifiers', () => ({ restrictToVerticalAxis: vi.fn() }))
vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: vi.fn(() => undefined) } },
}))

import React from 'react'

const doneAction: Action = {
  name: 'Done',
  label: 'Done',
  icon: CheckIcon,
  color: 'mint',
  destructive: false,
  callback: vi.fn(),
}

const removeAction: Action = {
  name: 'Remove',
  label: 'Remove',
  icon: DeleteIcon,
  color: 'danger',
  destructive: true,
  callback: vi.fn(),
}

describe('ActionCard', () => {
  it('renders children', () => {
    render(
      <ActionCard actions={[doneAction, removeAction]}>
        <span>Test content</span>
      </ActionCard>,
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders non-destructive zone button', () => {
    render(
      <ActionCard actions={[doneAction, removeAction]}>
        <span>Content</span>
      </ActionCard>,
    )
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders destructive zone button', () => {
    render(
      <ActionCard actions={[doneAction, removeAction]}>
        <span>Content</span>
      </ActionCard>,
    )
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  it('calls non-destructive action callback when zone button is clicked', () => {
    const callback = vi.fn()
    const action: Action = { ...doneAction, callback }
    render(
      <ActionCard actions={[action]}>
        <span>Content</span>
      </ActionCard>,
    )
    fireEvent.click(screen.getByText('Done'))
    expect(callback).toHaveBeenCalledOnce()
  })

  it('calls destructive action callback when left zone button is clicked', () => {
    const callback = vi.fn()
    const action: Action = { ...removeAction, callback }
    render(
      <ActionCard actions={[action]}>
        <span>Content</span>
      </ActionCard>,
    )
    fireEvent.click(screen.getByText('Remove'))
    expect(callback).toHaveBeenCalledOnce()
  })

  it('applies entering class when entering is true', () => {
    const { container } = render(
      <ActionCard actions={[]} entering={true}>
        <span>Content</span>
      </ActionCard>,
    )
    expect(container.querySelector('.entering')).toBeInTheDocument()
  })

  it('does not apply entering class by default', () => {
    const { container } = render(
      <ActionCard actions={[]}>
        <span>Content</span>
      </ActionCard>,
    )
    expect(container.querySelector('.entering')).not.toBeInTheDocument()
  })

  it('applies dragging class when drag.isDragging is true', () => {
    const drag = {
      ref: vi.fn(),
      listeners: {},
      style: {},
      isDragging: true,
    }
    const { container } = render(
      <ActionCard actions={[]} drag={drag}>
        <span>Content</span>
      </ActionCard>,
    )
    expect(container.querySelector('.dragging')).toBeInTheDocument()
  })

  it('renders drag handle when drag prop is provided', () => {
    const drag = {
      ref: vi.fn(),
      listeners: {},
      style: {},
      isDragging: false,
    }
    render(
      <ActionCard actions={[]} drag={drag}>
        <span>Content</span>
      </ActionCard>,
    )
    expect(screen.getByRole('button', { name: 'Drag to reorder' })).toBeInTheDocument()
  })

  it('does not render drag handle without drag prop', () => {
    render(
      <ActionCard actions={[]}>
        <span>Content</span>
      </ActionCard>,
    )
    expect(screen.queryByRole('button', { name: 'Drag to reorder' })).not.toBeInTheDocument()
  })

  describe('mobile swipe', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(pointer: coarse)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    })

    it('snaps card left when left-swiped past threshold', () => {
      render(
        <ActionCard actions={[removeAction]}>
          <span>Content</span>
        </ActionCard>,
      )
      const card = screen.getByText('Content').closest('.card') as HTMLElement
      fireEvent.touchStart(card, { touches: [{ clientX: 200 }] })
      fireEvent.touchMove(card, { touches: [{ clientX: 100 }] })
      fireEvent.touchEnd(card)
      expect(card.style.transform).toMatch(/translateX\(-\d+px\)/)
    })

    it('snaps card right when right-swiped past threshold', () => {
      render(
        <ActionCard actions={[doneAction]}>
          <span>Content</span>
        </ActionCard>,
      )
      const card = screen.getByText('Content').closest('.card') as HTMLElement
      fireEvent.touchStart(card, { touches: [{ clientX: 0 }] })
      fireEvent.touchMove(card, { touches: [{ clientX: 100 }] })
      fireEvent.touchEnd(card)
      expect(card.style.transform).toMatch(/translateX\(\d+px\)/)
    })
  })
})
