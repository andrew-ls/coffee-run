import type { MILK_TYPES, MILK_AMOUNTS, SWEETENER_TYPES } from '@/config'

export type MilkType = (typeof MILK_TYPES)[number]
export type MilkAmount = (typeof MILK_AMOUNTS)[number]
export type SweetenerType = (typeof SWEETENER_TYPES)[number]
