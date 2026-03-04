import type { OrderFormData } from '@/shared/types'
import type { Run } from '@/entities/run'

export interface ActiveOrder extends OrderFormData {
  id: string
  runId: Run['id']
  done: boolean
  createdAt: string
  updatedAt: string
}
