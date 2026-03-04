import type { OrderFormData } from '@/shared/types'

export interface SavedOrder {
  id: string
  userId: string
  orderData: OrderFormData
  createdAt: string
  updatedAt: string
}
