import type { OrderFormData } from './order'

export interface SavedOrder {
  id: string
  userId: string
  orderData: OrderFormData
  createdAt: string
  updatedAt: string
}
