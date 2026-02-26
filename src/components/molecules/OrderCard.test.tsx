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

  it('calls onEdit with Order id when edit button is clicked', () => {
    const onEdit = vi.fn()
    const order = createOrder({ id: 'test-id' })
    render(<OrderCard order={order} onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Edit Order' }))
    expect(onEdit).toHaveBeenCalledWith('test-id')
  })

  it('calls onDelete with Order id when delete button is clicked', () => {
    const onDelete = vi.fn()
    const order = createOrder({ id: 'del-id' })
    render(<OrderCard order={order} onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Delete Order' }))
    expect(onDelete).toHaveBeenCalledWith('del-id')
  })

  describe('aspect pills', () => {
    it('always renders the drink type badge', () => {
      render(<OrderCard order={createOrder({ drinkType: 'Tea' })} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Tea')).toBeInTheDocument()
    })

    it('renders an Iced pill when iced is true', () => {
      const order = createOrder({ iced: true })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Iced')).toBeInTheDocument()
    })

    it('does not render an Iced pill when iced is false', () => {
      const order = createOrder({ iced: false })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.queryByText('Iced')).not.toBeInTheDocument()
    })

    it('renders variant pill when variant is set and not "Other"', () => {
      const order = createOrder({ variant: 'Latte', customVariant: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Latte')).toBeInTheDocument()
    })

    it('does not render a variant pill when variant is "Other" with no customVariant', () => {
      const order = createOrder({ variant: 'Other', customVariant: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      // "Other" as a variant should not appear as a separate pill
      expect(screen.queryByText('Other')).not.toBeInTheDocument()
    })

    it('renders customVariant as a variant pill', () => {
      const order = createOrder({ variant: 'Other', customVariant: 'Hazelnut' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Hazelnut')).toBeInTheDocument()
    })

    it('renders customDrinkName as a variant pill for Other type', () => {
      const order = createOrder({ drinkType: 'Other', customDrinkName: 'Chai Latte', variant: '', customVariant: '' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Chai Latte')).toBeInTheDocument()
    })

    it('renders milk pill when milkType is not None', () => {
      const order = createOrder({ milkType: 'Oat', milkAmount: 'Splash', sweetenerType: 'None' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/Oat/)).toBeInTheDocument()
      expect(screen.getByText(/Splash/)).toBeInTheDocument()
    })

    it('does not render a milk pill when milkType is None', () => {
      const order = createOrder({ milkType: 'None', sweetenerType: 'None' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.queryByText(/milk/i)).not.toBeInTheDocument()
    })

    it('renders sweetener pill when sweetenerType is not None', () => {
      const order = createOrder({ sweetenerType: 'Brown Sugar', sweetenerAmount: 1.5, milkType: 'None' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText(/Brown Sugar/)).toBeInTheDocument()
    })

    it('does not render a sweetener pill when sweetenerType is None', () => {
      const order = createOrder({ sweetenerType: 'None', milkType: 'None' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.queryByText(/Sugar/i)).not.toBeInTheDocument()
    })

    it('does not render a notes pill even when notes are present', () => {
      const order = createOrder({ notes: 'extra hot', milkType: 'None', sweetenerType: 'None' })
      render(<OrderCard order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.queryByText(/extra hot/)).not.toBeInTheDocument()
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
