import { useState, useCallback, useMemo } from 'react'
import type { OrderFormData } from '@/types'
import { DRINKS, MILK_TYPES, MILK_AMOUNTS, SWEETENER_TYPES, SWEETENER_MIN, SWEETENER_MAX, SWEETENER_STEP } from '@/config'
import type { DrinkConfig } from '@/config'
import { Button, Input, Select, Checkbox } from '@/components/atoms'
import { FormField } from '@/components/molecules'
import styles from './OrderForm.module.css'

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

interface OrderFormProps {
  initialData?: Partial<OrderFormData>
  onSubmit: (data: OrderFormData, save: boolean) => void
  onCancel: () => void
  submitLabel?: string
}

export function OrderForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Add order',
}: OrderFormProps) {
  const [form, setForm] = useState<OrderFormData>({ ...EMPTY_FORM, ...initialData })
  const [saveForLater, setSaveForLater] = useState(false)

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

  const handleDrinkTypeChange = useCallback(
    (type: string) => {
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
    },
    [],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!form.personName.trim() || !form.drinkType) return
      onSubmit(form, saveForLater)
    },
    [form, saveForLater, onSubmit],
  )

  const variants = drinkConfig?.variants ?? []
  const variantOptions = drinkConfig?.allowOtherVariant
    ? [...variants, 'Other']
    : [...variants]

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <FormField label="Who's this for?">
        <Input
          value={form.personName}
          onChange={(e) => update('personName', e.target.value)}
          placeholder="Name"
          autoFocus
        />
      </FormField>

      <FormField label="Drink type">
        <Select
          value={form.drinkType}
          onChange={(e) => handleDrinkTypeChange(e.target.value)}
          options={DRINKS.map((d) => d.type)}
          placeholder="Pick a drink..."
        />
      </FormField>

      {drinkConfig?.allowCustomDrinkName && (
        <FormField label="What drink?">
          <Input
            value={form.customDrinkName}
            onChange={(e) => update('customDrinkName', e.target.value)}
            placeholder="Describe the drink"
          />
        </FormField>
      )}

      {variantOptions.length > 0 && (
        <FormField label="Variant">
          <Select
            value={form.variant}
            onChange={(e) => update('variant', e.target.value)}
            options={variantOptions as unknown as string[]}
            placeholder="Choose variant..."
          />
        </FormField>
      )}

      {showVariantOther && (
        <FormField label="Custom variant">
          <Input
            value={form.customVariant}
            onChange={(e) => update('customVariant', e.target.value)}
            placeholder="What kind?"
          />
        </FormField>
      )}

      {drinkConfig?.fields.iced && (
        <Checkbox
          label="Iced"
          checked={form.iced}
          onChange={(e) => update('iced', e.target.checked)}
        />
      )}

      {drinkConfig?.fields.milk && (
        <div className={styles.row}>
          <FormField label="Milk">
            <Select
              value={form.milkType}
              onChange={(e) => update('milkType', e.target.value as OrderFormData['milkType'])}
              options={MILK_TYPES}
            />
          </FormField>
          {drinkConfig.fields.milkAmount && form.milkType !== 'None' && (
            <FormField label="How much?">
              <Select
                value={form.milkAmount}
                onChange={(e) =>
                  update('milkAmount', e.target.value as OrderFormData['milkAmount'])
                }
                options={MILK_AMOUNTS}
              />
            </FormField>
          )}
        </div>
      )}

      {drinkConfig?.fields.sweetener && (
        <div className={styles.row}>
          <FormField label="Sweetener">
            <Select
              value={form.sweetenerType}
              onChange={(e) =>
                update('sweetenerType', e.target.value as OrderFormData['sweetenerType'])
              }
              options={SWEETENER_TYPES}
            />
          </FormField>
          {drinkConfig.fields.sweetenerAmount && form.sweetenerType !== 'None' && (
            <FormField label="How many?">
              <Input
                type="number"
                value={form.sweetenerAmount}
                onChange={(e) => update('sweetenerAmount', parseFloat(e.target.value) || 0)}
                min={SWEETENER_MIN}
                max={SWEETENER_MAX}
                step={SWEETENER_STEP}
              />
            </FormField>
          )}
        </div>
      )}

      {drinkConfig?.fields.notes && (
        <FormField label="Notes">
          <textarea
            className={styles.notes}
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="Extra shot, no foam, etc."
            rows={2}
          />
        </FormField>
      )}

      <div className={styles.saveRow}>
        <Checkbox
          label="Remember this one for next time?"
          checked={saveForLater}
          onChange={(e) => setSaveForLater(e.target.checked)}
        />
      </div>

      <div className={styles.row}>
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth disabled={!form.drinkType}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
