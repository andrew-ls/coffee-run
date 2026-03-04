import { useState, useCallback, useMemo, useEffect } from 'react'
import type { OrderFormData } from '@/shared/types'
import { DRINKS } from '@/shared/config'
import type { DrinkConfig } from '@/shared/config'

const EMPTY_FORM: OrderFormData = {
  personName: '',
  drinkType: '',
  variant: '',
  customVariant: '',
  iced: false,
  milkType: 'None',
  milkAmount: 'Splash',
  sweetenerType: 'None',
  sweetenerAmount: 0,
  customDrinkName: '',
  notes: '',
}

interface UseOrderFormParams {
  initialData?: Partial<OrderFormData>
  onSubmit: (data: OrderFormData, save: boolean) => void
  onValidityChange?: (valid: boolean) => void
}

export function useOrderForm({ initialData, onSubmit, onValidityChange }: UseOrderFormParams) {
  const [form, setForm] = useState<OrderFormData>({ ...EMPTY_FORM, ...initialData })
  const [saveForLater, setSaveForLater] = useState(false)

  useEffect(() => {
    onValidityChange?.(!!form.drinkType && !!form.personName.trim())
  }, [form.drinkType, form.personName, onValidityChange])

  const drinkConfig: DrinkConfig | undefined = useMemo(
    () => DRINKS.find((d) => d.type === form.drinkType),
    [form.drinkType],
  )

  const showVariantOther = form.variant === 'Other' && drinkConfig?.allowOtherVariant

  const update = useCallback(
    <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const handleDrinkTypeChange = useCallback((type: string) => {
    const config = DRINKS.find((d) => d.type === type)
    setForm((prev) => ({
      ...prev,
      drinkType: type,
      variant: '',
      customVariant: '',
      iced: false,
      milkType: config?.fields.milk ? prev.milkType : 'None',
      milkAmount: 'Splash',
      sweetenerType: config?.fields.sweetener ? prev.sweetenerType : 'None',
      sweetenerAmount: 0,
      customDrinkName: type === 'Other' ? prev.customDrinkName : '',
    }))
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!form.personName.trim() || !form.drinkType) return
      onSubmit(form, saveForLater)
    },
    [form, saveForLater, onSubmit],
  )

  const variants = drinkConfig?.variants ?? []
  const variantOptions = drinkConfig?.allowOtherVariant ? [...variants, 'Other'] : variants

  return {
    form,
    saveForLater,
    setSaveForLater,
    drinkConfig,
    showVariantOther,
    variantOptions,
    update,
    handleDrinkTypeChange,
    handleSubmit,
  }
}
