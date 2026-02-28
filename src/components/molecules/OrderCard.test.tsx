import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrderCard } from './OrderCard'
import { createOrder, createSavedOrder, createOrderFormData } from '@/test/fixtures'

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

describe('OrderCard', () => {
  describe('active mode', () => {
    it('renders person name', () => {
      render(<OrderCard mode="active" order={createOrder({ personName: 'Alice' })} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    it('renders the drink type badge', () => {
      render(<OrderCard mode="active" order={createOrder({ drinkType: 'Coffee' })} onEdit={vi.fn()} onDelete={vi.fn()} />)
      expect(screen.getByText('Coffee')).toBeInTheDocument()
    })

    it('calls onEdit with Order id when edit button is clicked', () => {
      const onEdit = vi.fn()
      const order = createOrder({ id: 'test-id' })
      render(<OrderCard mode="active" order={order} onEdit={onEdit} onDelete={vi.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: 'Edit Order' }))
      expect(onEdit).toHaveBeenCalledWith('test-id')
    })

    it('calls onDelete with Order id when delete button is clicked', () => {
      const onDelete = vi.fn()
      const order = createOrder({ id: 'del-id' })
      render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={onDelete} />)
      fireEvent.click(screen.getByRole('button', { name: 'Remove Order' }))
      expect(onDelete).toHaveBeenCalledWith('del-id')
    })

    describe('aspect pills', () => {
      it('always renders the drink type badge', () => {
        render(<OrderCard mode="active" order={createOrder({ drinkType: 'Tea' })} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText('Tea')).toBeInTheDocument()
      })

      it('renders an Iced pill when iced is true', () => {
        const order = createOrder({ iced: true })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText('Iced')).toBeInTheDocument()
      })

      it('does not render an Iced pill when iced is false', () => {
        const order = createOrder({ iced: false })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.queryByText('Iced')).not.toBeInTheDocument()
      })

      it('renders variant pill when variant is set and not "Other"', () => {
        const order = createOrder({ variant: 'Latte', customVariant: '' })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText('Latte')).toBeInTheDocument()
      })

      it('does not render a variant pill when variant is "Other" with no customVariant', () => {
        const order = createOrder({ variant: 'Other', customVariant: '' })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.queryByText('Other')).not.toBeInTheDocument()
      })

      it('renders customVariant as a variant pill', () => {
        const order = createOrder({ variant: 'Other', customVariant: 'Hazelnut' })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText('Hazelnut')).toBeInTheDocument()
      })

      it('renders customDrinkName as a variant pill for Other type', () => {
        const order = createOrder({ drinkType: 'Other', customDrinkName: 'Chai Latte', variant: '', customVariant: '' })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText('Chai Latte')).toBeInTheDocument()
      })

      it('renders milk pill when milkType is not None', () => {
        const order = createOrder({ milkType: 'Oat', milkAmount: 'Splash', sweetenerType: 'None' })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText(/Oat/)).toBeInTheDocument()
        expect(screen.getByText(/Splash/)).toBeInTheDocument()
      })

      it('does not render a milk pill when milkType is None', () => {
        const order = createOrder({ milkType: 'None', sweetenerType: 'None' })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.queryByText(/milk/i)).not.toBeInTheDocument()
      })

      it('renders sweetener pill when sweetenerType is not None', () => {
        const order = createOrder({ sweetenerType: 'Brown Sugar', sweetenerAmount: 1.5, milkType: 'None' })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText(/Brown Sugar/)).toBeInTheDocument()
      })

      it('does not render a sweetener pill when sweetenerType is None', () => {
        const order = createOrder({ sweetenerType: 'None', milkType: 'None' })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.queryByText(/Sugar/i)).not.toBeInTheDocument()
      })

      it('does not render a notes pill even when notes are present', () => {
        const order = createOrder({ notes: 'extra hot', milkType: 'None', sweetenerType: 'None' })
        render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.queryByText(/extra hot/)).not.toBeInTheDocument()
      })
    })

    describe('mobile layout', () => {
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

      it('applies swipe transform on mobile', () => {
        const order = createOrder()
        const { container } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        expect(card).toBeInTheDocument()
      })

      it('handles touch start, move and end on the card', () => {
        const order = createOrder()
        const { container } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 100 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 70 }] })
        fireEvent.touchEnd(card)
        expect(card).toBeInTheDocument()
      })

      it('reveals swipe delete zone after threshold swipe', () => {
        const order = createOrder()
        const { container } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 200 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 100 }] })
        fireEvent.touchEnd(card)
        expect(card.style.transform).toBe('translateX(-100px)')
      })

      it('calls onDelete when swipe delete zone is clicked', () => {
        const onDelete = vi.fn()
        const order = createOrder({ id: 'swipe-id' })
        const { getByText } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={onDelete} />)
        fireEvent.click(getByText('Remove'))
        expect(onDelete).toHaveBeenCalledWith('swipe-id')
      })

      it('updates offset when touch moves in positive direction (right swipe enabled)', () => {
        const order = createOrder()
        const { container } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 100 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 150 }] })
        expect(card.style.transform).toBe('translateX(50px)')
      })

      it('reveals edit zone after threshold right swipe', () => {
        const order = createOrder()
        const { container } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 0 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 100 }] })
        fireEvent.touchEnd(card)
        expect(card.style.transform).toBe('translateX(100px)')
      })

      it('calls onEdit when edit zone is tapped after right swipe', () => {
        const onEdit = vi.fn()
        const order = createOrder({ id: 'edit-swipe-id' })
        const { getByText, container } = render(<OrderCard mode="active" order={order} onEdit={onEdit} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 0 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 100 }] })
        fireEvent.touchEnd(card)
        fireEvent.click(getByText('Edit'))
        expect(onEdit).toHaveBeenCalledWith('edit-swipe-id')
      })

      it('snaps card back when right swipe is below threshold', () => {
        const order = createOrder()
        const { container } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 0 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 50 }] })
        fireEvent.touchEnd(card)
        expect(card.style.transform).toBe('translateX(0px)')
      })

      it('elevates editZone z-index during right swipe', () => {
        const order = createOrder()
        const { container } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        const editZone = container.querySelector('.editZone') as HTMLElement
        const deleteZone = container.querySelector('.deleteZone') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 0 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 50 }] })
        expect(editZone.style.zIndex).toBe('1')
        expect(deleteZone.style.zIndex).toBe('0')
      })

      it('elevates deleteZone z-index during left swipe', () => {
        const order = createOrder()
        const { container } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        const editZone = container.querySelector('.editZone') as HTMLElement
        const deleteZone = container.querySelector('.deleteZone') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 100 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 60 }] })
        expect(deleteZone.style.zIndex).toBe('1')
        expect(editZone.style.zIndex).toBe('0')
      })

      it('resets z-index on both zones after snap-back transitionEnd', () => {
        const order = createOrder()
        const { container } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        const editZone = container.querySelector('.editZone') as HTMLElement
        const deleteZone = container.querySelector('.deleteZone') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 0 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 50 }] })
        fireEvent.touchEnd(card)
        fireEvent.transitionEnd(card, { propertyName: 'transform' })
        expect(editZone.style.zIndex).toBe('0')
        expect(deleteZone.style.zIndex).toBe('0')
      })

      it('continues swipe relative to locked position', () => {
        const order = createOrder()
        const { container } = render(<OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} />)
        const card = container.querySelector('.card') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 200 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 100 }] })
        fireEvent.touchEnd(card)
        fireEvent.touchStart(card, { touches: [{ clientX: 150 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 180 }] })
        expect(card.style.transform).toBe('translateX(-70px)')
      })
    })

    it('applies dragging class when isDragging is true', () => {
      const order = createOrder()
      const { container } = render(
        <OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} isDragging={true} />,
      )
      const card = container.querySelector('.dragging')
      expect(card).toBeInTheDocument()
    })

    it('applies entering class when isNew is true', () => {
      const order = createOrder()
      const { container } = render(
        <OrderCard mode="active" order={order} onEdit={vi.fn()} onDelete={vi.fn()} isNew={true} />,
      )
      const card = container.querySelector('.entering')
      expect(card).toBeInTheDocument()
    })
  })

  describe('saved mode', () => {
    const savedOrder = createSavedOrder({
      id: 's1',
      orderData: createOrderFormData({ personName: 'Bob', drinkType: 'Tea', variant: 'Earl Grey' }),
    })

    it('renders person name', () => {
      render(
        <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })

    it('renders the drink type badge', () => {
      render(
        <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      expect(screen.getByText('Tea')).toBeInTheDocument()
    })

    it('shows variant as a pill', () => {
      render(
        <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      expect(screen.getByText('Earl Grey')).toBeInTheDocument()
    })

    it('shows customDrinkName as a pill when variant is empty', () => {
      const order = createSavedOrder({
        orderData: createOrderFormData({ drinkType: 'Other', variant: '', customDrinkName: 'Matcha' }),
      })
      render(
        <OrderCard mode="saved" savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      expect(screen.getByText('Matcha')).toBeInTheDocument()
    })

    it('calls onUsual with the Saved Order when usual button is clicked', () => {
      const onUsual = vi.fn()
      render(
        <OrderCard mode="saved" savedOrder={savedOrder} onUsual={onUsual} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Use' }))
      expect(onUsual).toHaveBeenCalledWith(savedOrder)
    })

    it('calls onCustom with the Saved Order when custom button is clicked', () => {
      const onCustom = vi.fn()
      render(
        <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={onCustom} onDelete={vi.fn()} />,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Customised' }))
      expect(onCustom).toHaveBeenCalledWith(savedOrder)
    })

    it('calls onDelete with Saved Order id when delete zone is clicked', () => {
      const onDelete = vi.fn()
      render(
        <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={onDelete} />,
      )
      fireEvent.click(screen.getByText('Delete'))
      expect(onDelete).toHaveBeenCalledWith('s1')
    })

    it('calls onDelete with Saved Order id when delete button is clicked', () => {
      const onDelete = vi.fn()
      render(
        <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={onDelete} />,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
      expect(onDelete).toHaveBeenCalledWith('s1')
    })

    describe('aspect pills', () => {
      it('renders an Iced pill when iced is true', () => {
        const order = createSavedOrder({
          orderData: createOrderFormData({ iced: true, milkType: 'None', sweetenerType: 'None' }),
        })
        render(<OrderCard mode="saved" savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText('Iced')).toBeInTheDocument()
      })

      it('does not render an Iced pill when iced is false', () => {
        const order = createSavedOrder({
          orderData: createOrderFormData({ iced: false, milkType: 'None', sweetenerType: 'None' }),
        })
        render(<OrderCard mode="saved" savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.queryByText('Iced')).not.toBeInTheDocument()
      })

      it('does not render a variant pill when variant is "Other" with no customVariant', () => {
        const order = createSavedOrder({
          orderData: createOrderFormData({ drinkType: 'Coffee', variant: 'Other', customVariant: '', milkType: 'None', sweetenerType: 'None' }),
        })
        render(<OrderCard mode="saved" savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.queryByText('Other')).not.toBeInTheDocument()
      })

      it('renders customVariant as a variant pill', () => {
        const order = createSavedOrder({
          orderData: createOrderFormData({ variant: 'Other', customVariant: 'Hazelnut' }),
        })
        render(<OrderCard mode="saved" savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText('Hazelnut')).toBeInTheDocument()
      })

      it('renders milk pill when milkType is not None', () => {
        const order = createSavedOrder({
          orderData: createOrderFormData({ milkType: 'Oat', milkAmount: 'Splash', sweetenerType: 'None' }),
        })
        render(<OrderCard mode="saved" savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText(/Oat/)).toBeInTheDocument()
      })

      it('does not render a milk pill when milkType is None', () => {
        const order = createSavedOrder({
          orderData: createOrderFormData({ milkType: 'None', sweetenerType: 'None' }),
        })
        render(<OrderCard mode="saved" savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.queryByText(/milk/i)).not.toBeInTheDocument()
      })

      it('renders sweetener pill when sweetenerType is not None', () => {
        const order = createSavedOrder({
          orderData: createOrderFormData({ milkType: 'None', sweetenerType: 'Brown Sugar', sweetenerAmount: 2 }),
        })
        render(<OrderCard mode="saved" savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.getByText(/Brown Sugar/)).toBeInTheDocument()
      })

      it('does not render a sweetener pill when sweetenerType is None', () => {
        const order = createSavedOrder({
          orderData: createOrderFormData({ milkType: 'None', sweetenerType: 'None' }),
        })
        render(<OrderCard mode="saved" savedOrder={order} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />)
        expect(screen.queryByText(/Sugar/i)).not.toBeInTheDocument()
      })
    })

    describe('mobile touch handling', () => {
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

      it('handles touch start, move, and end events', () => {
        const { container } = render(
          <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
        )
        const card = container.querySelector('[style*="translateX"]') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 200 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 150 }] })
        fireEvent.touchEnd(card)
        expect(card).toBeInTheDocument()
      })

      it('snaps card when swipe exceeds threshold', () => {
        const { container } = render(
          <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
        )
        const card = container.querySelector('[style*="translateX"]') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 200 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 100 }] })
        fireEvent.touchEnd(card)
        expect(card).toBeInTheDocument()
      })

      it('updates offset when touch moves in positive direction (right swipe enabled)', () => {
        const { container } = render(
          <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
        )
        const card = container.querySelector('[style*="translateX"]') as HTMLElement
        fireEvent.touchStart(card, { touches: [{ clientX: 100 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 150 }] })
        expect(card.style.transform).toBe('translateX(50px)')
      })

      it('calls onUsual when the usual swipe zone is clicked', () => {
        const onUsual = vi.fn()
        render(
          <OrderCard mode="saved" savedOrder={savedOrder} onUsual={onUsual} onCustom={vi.fn()} onDelete={vi.fn()} />,
        )
        fireEvent.click(screen.getByText('Use'))
        expect(onUsual).toHaveBeenCalledWith(savedOrder)
      })

      it('calls onCustom when the custom swipe zone is clicked', () => {
        const onCustom = vi.fn()
        render(
          <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={onCustom} onDelete={vi.fn()} />,
        )
        fireEvent.click(screen.getByText('Customised'))
        expect(onCustom).toHaveBeenCalledWith(savedOrder)
      })
    })

    it('applies dragging class when isDragging is true', () => {
      const { container } = render(
        <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} isDragging={true} />,
      )
      const card = container.querySelector('.dragging')
      expect(card).toBeInTheDocument()
    })

    it('does not apply entering class in saved mode', () => {
      const { container } = render(
        <OrderCard mode="saved" savedOrder={savedOrder} onUsual={vi.fn()} onCustom={vi.fn()} onDelete={vi.fn()} />,
      )
      const card = container.querySelector('.entering')
      expect(card).not.toBeInTheDocument()
    })
  })
})
