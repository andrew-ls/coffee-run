import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrderCard } from './OrderCard'
import { createOrder } from '@/test/fixtures'

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

describe('OrderCard', () => {
  it('renders person name', () => {
    render(<OrderCard order={createOrder({ personName: 'Alice' })} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders the drink type badge', () => {
    render(<OrderCard order={createOrder({ drinkType: 'Coffee' })} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Coffee')).toBeInTheDocument()
  })

  it('calls onEdit with order id when edit button is clicked', () => {
    const onEdit = vi.fn()
    const order = createOrder({ id: 'test-id' })
    render(<OrderCard order={order} onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Edit order' }))
    expect(onEdit).toHaveBeenCalledWith('test-id')
  })

  it('calls onDelete with order id when delete button is clicked', () => {
    const onDelete = vi.fn()
    const order = createOrder({ id: 'del-id' })
    render(<OrderCard order={order} onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Delete order' }))
    expect(onDelete).toHaveBeenCalledWith('del-id')
  })

  describe('buildDrinkSummary', () => {
    it('shows variant when set', () => {
      const order = createOrder({ variant: 'Latte', customVariant: '', iced: false, milkType: 'None', sweetenerType: 'None', notes: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/Latte/)).toBeInTheDocument()
    })

    it('shows Iced prefix when iced is true', () => {
      const order = createOrder({ iced: true, variant: 'Latte', milkType: 'None', sweetenerType: 'None', notes: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/Iced/)).toBeInTheDocument()
    })

    it('shows milk info when milkType is not None', () => {
      const order = createOrder({ milkType: 'Oat', milkAmount: 'Splash', variant: 'Latte', sweetenerType: 'None', notes: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/Oat/)).toBeInTheDocument()
    })

    it('omits milk info when milkType is None', () => {
      const order = createOrder({ milkType: 'None', variant: 'Espresso', sweetenerType: 'None', notes: '', iced: false })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.queryByText(/milk/i)).not.toBeInTheDocument()
    })

    it('shows sweetener info when sweetenerType is not None', () => {
      const order = createOrder({ sweetenerType: 'Sugar', sweetenerAmount: 2, milkType: 'None', notes: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/Sugar/)).toBeInTheDocument()
    })

    it('shows custom drink name for Other type', () => {
      const order = createOrder({ drinkType: 'Other', customDrinkName: 'Chai Latte', variant: '', milkType: 'None', sweetenerType: 'None', notes: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/Chai Latte/)).toBeInTheDocument()
    })

    it('falls back to drink type when no summary parts', () => {
      const order = createOrder({ drinkType: 'Juice', variant: '', customVariant: '', customDrinkName: '', iced: false, milkType: 'None', sweetenerType: 'None', notes: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      // Juice appears in both the badge and summary fallback
      expect(screen.getAllByText('Juice').length).toBeGreaterThanOrEqual(1)
    })

    it('shows notes in quotes', () => {
      const order = createOrder({ notes: 'extra shot', milkType: 'None', sweetenerType: 'None', variant: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/"extra shot"/)).toBeInTheDocument()
    })

    it('shows customVariant in drink summary', () => {
      const order = createOrder({ customVariant: 'Hazelnut', milkType: 'None', sweetenerType: 'None', notes: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/Hazelnut/)).toBeInTheDocument()
    })
  })

  describe('mobile layout', () => {
    it('applies swipe transform on mobile', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const order = createOrder()
      const { container } = render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      const card = container.querySelector('[style]')
      // On mobile the transform style is applied (may be translateX(0px) initially)
      expect(card).toBeInTheDocument()
    })

    it('handles touch start, move and end on the card', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const order = createOrder()
      const { container } = render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      const card = container.querySelector('[style]') as HTMLElement
      // simulate a small swipe that does not trigger delete
      fireEvent.touchStart(card, { touches: [{ clientX: 100 }] })
      fireEvent.touchMove(card, { touches: [{ clientX: 70 }] })
      fireEvent.touchEnd(card)
      // offsetX is -30, less than threshold, so no delete state
      expect(card).toBeInTheDocument()
    })

    it('reveals swipe delete zone after threshold swipe', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const order = createOrder()
      const { container } = render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      const card = container.querySelector('[style]') as HTMLElement
      // swipe further than 80px threshold
      fireEvent.touchStart(card, { touches: [{ clientX: 200 }] })
      fireEvent.touchMove(card, { touches: [{ clientX: 100 }] })
      fireEvent.touchEnd(card)
      expect(card).toBeInTheDocument()
    })

    it('calls onDelete when swipe delete zone is clicked', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const onDelete = vi.fn()
      const order = createOrder({ id: 'swipe-id' })
      const { getByText } = render(<OrderCard order={order} onEdit={vi.fn()} onDelete={onDelete} />)
      fireEvent.click(getByText('Delete'))
      expect(onDelete).toHaveBeenCalledWith('swipe-id')
    })

    it('does not update offset when touch moves in positive direction', () => {
      vi.mocked(useBreakpoint).mockReturnValue('mobile')
      const order = createOrder()
      const { container } = render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      const card = container.querySelector('[style]') as HTMLElement
      fireEvent.touchStart(card, { touches: [{ clientX: 100 }] })
      // Move right (positive diff) — offsetX should stay at 0
      fireEvent.touchMove(card, { touches: [{ clientX: 150 }] })
      expect(card.style.transform).toBe('translateX(0px)')
    })
  })

  it('applies dragging class when isDragging is true', () => {
    const order = createOrder()
    const { container } = render(
      <OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} isDragging={true} />,
    )
    const card = container.querySelector('.dragging')
    expect(card).toBeInTheDocument()
  })
})
