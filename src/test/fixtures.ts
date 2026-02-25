import type { Run, Order, SavedOrder, OrderFormData } from '@/types'

export function createRun(overrides: Partial<Run> = {}): Run {
  return {
    id: 'run-1',
    userId: 'default-user',
    createdAt: '2024-01-15T12:00:00.000Z',
    archivedAt: null,
    ...overrides,
  }
}

export function createOrderFormData(overrides: Partial<OrderFormData> = {}): OrderFormData {
  return {
    personName: 'Alice',
    drinkType: 'Coffee',
    variant: 'Latte',
    customVariant: '',
    iced: false,
    milkType: 'Oat',
    milkAmount: 'Splash',
    sweetenerType: 'None',
    sweetenerAmount: 0,
    customDrinkName: '',
    notes: '',
    ...overrides,
  }
}

export function createOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-1',
    runId: 'run-1',
    personName: 'Alice',
    drinkType: 'Coffee',
    variant: 'Latte',
    customVariant: '',
    iced: false,
    milkType: 'Oat',
    milkAmount: 'Splash',
    sweetenerType: 'None',
    sweetenerAmount: 0,
    customDrinkName: '',
    notes: '',
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
    ...overrides,
  }
}

export function createSavedOrder(overrides: Partial<SavedOrder> = {}): SavedOrder {
  return {
    id: 'saved-1',
    userId: 'default-user',
    orderData: createOrderFormData(),
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
    ...overrides,
  }
}
