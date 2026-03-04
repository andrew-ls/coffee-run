import type { MilkType, MilkAmount, SweetenerType } from './drink'

export interface OrderFormData {
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
}
