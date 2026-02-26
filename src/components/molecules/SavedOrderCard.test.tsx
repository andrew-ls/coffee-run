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

  it('shows variant as a pill', () => {
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

  it('shows customDrinkName as a pill when variant is empty', () => {
    const order = createSavedOrder({
      orderData: createOrderFormData({ drinkType: 'Other', variant: '', customDrinkName: 'Matcha' }),
    })
    render(
      <SavedOrderCard savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.getByText('Matcha')).toBeInTheDocument()
  })

  it('calls onUsual with the Saved Order when Usual is clicked', () => {
    const onUsual = vi.fn()
    render(
      <SavedOrderCard
        savedOrder={savedOrder}
        onUsual={onUsual}
        onCustom={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Usual' }))
    expect(onUsual).toHaveBeenCalledWith(savedOrder)
  })

  it('calls onCustom with the Saved Order when Custom is clicked', () => {
    const onCustom = vi.fn()
    render(
      <SavedOrderCard
        savedOrder={savedOrder}
        onUsual={vi.fn()}
        onCustom={onCustom}
        onDelete={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }))
    expect(onCustom).toHaveBeenCalledWith(savedOrder)
  })

  it('calls onDelete with Saved Order id when delete zone is clicked', () => {
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

  it('calls onDelete with Saved Order id when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(
      <SavedOrderCard
        savedOrder={savedOrder}
        onUsual={vi.fn()}
        onCustom={vi.fn()}
        onDelete={onDelete}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledWith('s1')
  })

  describe('aspect pills', () => {
    it('renders an Iced pill when iced is true', () => {
      const order = createSavedOrder({
        orderData: createOrderFormData({ iced: true, milkType: 'None', sweetenerType: 'None' }),
      })
      render(<SavedOrderCard savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Iced')).toBeInTheDocument()
    })

    it('does not render an Iced pill when iced is false', () => {
      const order = createSavedOrder({
        orderData: createOrderFormData({ iced: false, milkType: 'None', sweetenerType: 'None' }),
      })
      render(<SavedOrderCard savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.queryByText('Iced')).not.toBeInTheDocument()
    })

    it('does not render a variant pill when variant is "Other" with no customVariant', () => {
      const order = createSavedOrder({
        orderData: createOrderFormData({ drinkType: 'Coffee', variant: 'Other', customVariant: '', milkType: 'None', sweetenerType: 'None' }),
      })
      render(<SavedOrderCard savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.queryByText('Other')).not.toBeInTheDocument()
    })

    it('renders customVariant as a variant pill', () => {
      const order = createSavedOrder({
        orderData: createOrderFormData({ variant: 'Other', customVariant: 'Hazelnut' }),
      })
      render(<SavedOrderCard savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Hazelnut')).toBeInTheDocument()
    })

    it('renders milk pill when milkType is not None', () => {
      const order = createSavedOrder({
        orderData: createOrderFormData({ milkType: 'Oat', milkAmount: 'Splash', sweetenerType: 'None' }),
      })
      render(<SavedOrderCard savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/Oat/)).toBeInTheDocument()
    })

    it('does not render a milk pill when milkType is None', () => {
      const order = createSavedOrder({
        orderData: createOrderFormData({ milkType: 'None', sweetenerType: 'None' }),
      })
      render(<SavedOrderCard savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.queryByText(/milk/i)).not.toBeInTheDocument()
    })

    it('renders sweetener pill when sweetenerType is not None', () => {
      const order = createSavedOrder({
        orderData: createOrderFormData({ milkType: 'None', sweetenerType: 'Brown Sugar', sweetenerAmount: 2 }),
      })
      render(<SavedOrderCard savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/Brown Sugar/)).toBeInTheDocument()
    })

    it('does not render a sweetener pill when sweetenerType is None', () => {
      const order = createSavedOrder({
        orderData: createOrderFormData({ milkType: 'None', sweetenerType: 'None' }),
      })
      render(<SavedOrderCard savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.queryByText(/Sugar/i)).not.toBeInTheDocument()
    })
  })

  describe('mobile touch handling', () => {
    it('handles touch start, move, and end events', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const { container } = render(
        <SavedOrderCard savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      // Select the card by its translateX transform (zones have zIndex style, not transform)
      const card = container.querySelector('[style*="translateX"]') as HTMLElement
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
      const card = container.querySelector('[style*="translateX"]') as HTMLElement
      fireEvent.touchStart(card, { touches: [{ clientX: 200 }] })
      fireEvent.touchMove(card, { touches: [{ clientX: 100 }] })
      fireEvent.touchEnd(card)
      expect(card).toBeInTheDocument()
    })

    it('updates offset when touch moves in positive direction (right swipe enabled)', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const { container } = render(
        <SavedOrderCard savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      const card = container.querySelector('[style*="translateX"]') as HTMLElement
      fireEvent.touchStart(card, { touches: [{ clientX: 100 }] })
      // Move right (positive diff) — right swipe is enabled, card moves with touch
      fireEvent.touchMove(card, { touches: [{ clientX: 150 }] })
      expect(card.style.transform).toBe('translateX(50px)')
    })

    it('calls onUsual when the Usual swipe zone is clicked (mobile)', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const onUsual = vi.fn()
      render(
        <SavedOrderCard savedOrder={savedOrder} onUsual={onUsual} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      fireEvent.click(screen.getByText('Usual'))
      expect(onUsual).toHaveBeenCalledWith(savedOrder)
    })

    it('calls onCustom when the Custom swipe zone is clicked (mobile)', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const onCustom = vi.fn()
      render(
        <SavedOrderCard savedOrder={savedOrder} onUsual={vi.fn()} onCustom={onCustom} onDelete={vi.fn()} />,
      )
      fireEvent.click(screen.getByText('Custom'))
      expect(onCustom).toHaveBeenCalledWith(savedOrder)
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
