import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AddOrder } from './AddOrder'
import { createSavedOrder, createOrderFormData } from '@/test/fixtures'
import type { SavedOrder } from '@/types'

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

const defaultProps = {
  savedOrders: [] as SavedOrder[],
  onNewOrder: vi.fn(),
  onUsual: vi.fn(),
  onCustom: vi.fn(),
  onDeleteSaved: vi.fn(),
  onReorderSaved: vi.fn(),
  onBack: vi.fn(),
}

describe('AddOrder', () => {
  it('renders the title', () => {
    render(<AddOrder {...defaultProps} />)
    expect(screen.getByText('Add Order')).toBeInTheDocument()
  })

  it('renders New Order button', () => {
    render(<AddOrder {...defaultProps} />)
    expect(screen.getByText('New Order')).toBeInTheDocument()
  })

  it('calls onNewOrder when New Order is clicked', () => {
    const onNewOrder = vi.fn()
    render(<AddOrder {...defaultProps} onNewOrder={onNewOrder} />)
    fireEvent.click(screen.getByText('New Order'))
    expect(onNewOrder).toHaveBeenCalledOnce()
  })

  it('shows Back button when showBack is true (default)', () => {
    render(<AddOrder {...defaultProps} />)
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('hides Back button when showBack is false', () => {
    render(<AddOrder {...defaultProps} showBack={false} />)
    expect(screen.queryByText('Back')).not.toBeInTheDocument()
  })

  it('calls onBack when Back is clicked', () => {
    const onBack = vi.fn()
    render(<AddOrder {...defaultProps} onBack={onBack} />)
    fireEvent.click(screen.getByText('Back'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('shows Saved Orders', () => {
    const saved = [
      createSavedOrder({ id: 's1', orderData: createOrderFormData({ personName: 'Eve' }) }),
    ]
    render(<AddOrder {...defaultProps} savedOrders={saved} />)
    expect(screen.getByText('Eve')).toBeInTheDocument()
  })

  it('shows Saved Orders section title', () => {
    render(<AddOrder {...defaultProps} />)
    expect(screen.getByText('Saved Orders')).toBeInTheDocument()
  })

  it('wires onUsual to Saved Order cards', () => {
    const onUsual = vi.fn()
    const saved = [createSavedOrder({ id: 's1' })]
    render(<AddOrder {...defaultProps} savedOrders={saved} onUsual={onUsual} />)
    fireEvent.click(screen.getByText('Usual'))
    expect(onUsual).toHaveBeenCalledWith(saved[0])
  })

  it('wires onCustom to Saved Order cards', () => {
    const onCustom = vi.fn()
    const saved = [createSavedOrder({ id: 's1' })]
    render(<AddOrder {...defaultProps} savedOrders={saved} onCustom={onCustom} />)
    fireEvent.click(screen.getByText('Custom'))
    expect(onCustom).toHaveBeenCalledWith(saved[0])
  })
})
