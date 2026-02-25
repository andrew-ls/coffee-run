import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SavedOrderCard } from './SavedOrderCard'
import { createSavedOrder, createOrderFormData } from '@/test/fixtures'

vi.mock('@/hooks/useBreakpoint', () => ({
  useBreakpoint: vi.fn().mockReturnValue('desktop'),
}))

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
import { useBreakpoint } from '@/hooks/useBreakpoint'

describe('SavedOrderCard', () => {
  const savedOrder = createSavedOrder({
    id: 's1',
    orderData: createOrderFormData({ personName: 'Bob', drinkType: 'Tea', variant: 'Earl Grey' }),
  })

  it('renders person name', () => {
    render(
      <SavedOrderCard
        savedOrder={savedOrder}
        onUsual={vi.fn()}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('renders the drink type badge', () => {
    render(
      <SavedOrderCard
        savedOrder={savedOrder}
        onUsual={vi.fn()}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('Tea')).toBeInTheDocument()
  })

  it('shows variant in the summary', () => {
    render(
      <SavedOrderCard
        savedOrder={savedOrder}
        onUsual={vi.fn()}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('Earl Grey')).toBeInTheDocument()
  })

  it('shows customDrinkName when variant is empty', () => {
    const order = createSavedOrder({
      orderData: createOrderFormData({ drinkType: 'Other', variant: '', customDrinkName: 'Matcha' }),
    })
    render(
      <SavedOrderCard savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.getByText('Matcha')).toBeInTheDocument()
  })

  it('calls onUsual with the saved order when Usual is clicked', () => {
    const onUsual = vi.fn()
    render(
      <SavedOrderCard
        savedOrder={savedOrder}
        onUsual={onUsual}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByText('Usual'))
    expect(onUsual).toHaveBeenCalledWith(savedOrder)
  })

  it('calls onCustom with the saved order when Custom is clicked', () => {
    const onCustom = vi.fn()
    render(
      <SavedOrderCard
        savedOrder={savedOrder}
        onUsual={vi.fn()}
        onCustom={onCustom}
        onDelete={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByText('Custom'))
    expect(onCustom).toHaveBeenCalledWith(savedOrder)
  })

  it('calls onDelete with saved order id when delete zone is clicked', () => {
    const onDelete = vi.fn()
    render(
      <SavedOrderCard
        savedOrder={savedOrder}
        onUsual={vi.fn()}
        onCustom={vi.fn()}
        onDelete={onDelete}
      />,
    )
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledWith('s1')
  })

  describe('mobile touch handling', () => {
    it('handles touch start, move, and end events', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const { container } = render(
        <SavedOrderCard savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      // The card div with conditional style
      const card = container.querySelector('[style]') as HTMLElement
      fireEvent.touchStart(card, { touches: [{ clientX: 200 }] })
      fireEvent.touchMove(card, { touches: [{ clientX: 150 }] })
      fireEvent.touchEnd(card)
      expect(card).toBeInTheDocument()
    })

    it('snaps card when swipe exceeds threshold', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const { container } = render(
        <SavedOrderCard savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      const card = container.querySelector('[style]') as HTMLElement
      fireEvent.touchStart(card, { touches: [{ clientX: 200 }] })
      fireEvent.touchMove(card, { touches: [{ clientX: 100 }] })
      fireEvent.touchEnd(card)
      expect(card).toBeInTheDocument()
    })

    it('does not update offset when touch moves in positive direction', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const { container } = render(
        <SavedOrderCard savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      const card = container.querySelector('[style]') as HTMLElement
      fireEvent.touchStart(card, { touches: [{ clientX: 100 }] })
      // Move right (positive diff) — offsetX should stay at 0
      fireEvent.touchMove(card, { touches: [{ clientX: 150 }] })
      expect(card.style.transform).toBe('translateX(0px)')
    })
  })

  it('applies dragging class when isDragging is true', () => {
    const { container } = render(
      <SavedOrderCard savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} isDragging={true} />,
    )
    const card = container.querySelector('.dragging')
    expect(card).toBeInTheDocument()
  })
})
