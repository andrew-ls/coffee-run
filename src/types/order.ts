import type { MilkType, MilkAmount, SweetenerType } from './drink'

export interface Order {
  id: string
  runId: string
  personName: string
  drinkType: string
  variant: string
  customVariant: string
  iced: boolean
  milkType: MilkType
  milkAmount: MilkAmount
  sweetenerType: SweetenerType
  sweetenerAmount: number
  customDrinkName: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type OrderFormData = Omit<Order, 'id' | 'runId' | 'createdAt' | 'updatedAt'>
