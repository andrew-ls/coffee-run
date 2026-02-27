import { useState, useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  showActions?: boolean
  onValidityChange?: (valid: boolean) => void
}

export function OrderForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
  showActions = true,
  onValidityChange,
}: OrderFormProps) {
  const { t } = useTranslation()
  const [form, setForm] = useState<OrderFormData>({ ...EMPTY_FORM, ...initialData })
  const [saveForLater, setSaveForLater] = useState(false)

  useEffect(() => {
    onValidityChange?.(!!form.drinkType)
  }, [form.drinkType, onValidityChange])

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
    : variants

  return (
    <form id="order-form" className={styles.form} onSubmit={handleSubmit}>
      <FormField label={t('orderForm.whoFor')}>
        <Input
          value={form.personName}
          onChange={(e) => update('personName', e.target.value)}
          placeholder={t('orderForm.namePlaceholder')}
          autoFocus
        />
      </FormField>

      <FormField label={t('orderForm.drinkType')}>
        <Select
          value={form.drinkType}
          onChange={(e) => handleDrinkTypeChange(e.target.value)}
          options={DRINKS.map((d) => ({ value: d.type, label: t(`drinks.${d.type}`) }))}
          placeholder={t('orderForm.pickDrink')}
        />
      </FormField>

      {drinkConfig?.allowCustomDrinkName && (
        <FormField label={t('orderForm.whatDrink')}>
          <Input
            value={form.customDrinkName}
            onChange={(e) => update('customDrinkName', e.target.value)}
            placeholder={t('orderForm.describeDrink')}
          />
        </FormField>
      )}

      {variantOptions.length > 0 && (
        <FormField label={t('orderForm.variant')}>
          <Select
            value={form.variant}
            onChange={(e) => update('variant', e.target.value)}
            options={variantOptions.map((v) => ({ value: v, label: t(`drinks.variants.${v}`) }))}
            placeholder={t('orderForm.chooseVariant')}
          />
        </FormField>
      )}

      {showVariantOther && (
        <FormField label={t('orderForm.customVariant')}>
          <Input
            value={form.customVariant}
            onChange={(e) => update('customVariant', e.target.value)}
            placeholder={t('orderForm.whatKind')}
          />
        </FormField>
      )}

      {drinkConfig?.fields.iced && (
        <Checkbox
          label={t('orderForm.iced')}
          checked={form.iced}
          onChange={(e) => update('iced', e.target.checked)}
        />
      )}

      {drinkConfig?.fields.milk && (
        <div className={styles.row}>
          <FormField label={t('orderForm.milk')}>
            <Select
              value={form.milkType}
              onChange={(e) => update('milkType', e.target.value as OrderFormData['milkType'])}
              options={MILK_TYPES.map((m) => ({ value: m, label: t(`milkTypes.${m}`) }))}
            />
          </FormField>
          {drinkConfig.fields.milkAmount && form.milkType !== 'None' && (
            <FormField label={t('orderForm.howMuch')}>
              <Select
                value={form.milkAmount}
                onChange={(e) =>
                  update('milkAmount', e.target.value as OrderFormData['milkAmount'])
                }
                options={MILK_AMOUNTS.map((a) => ({ value: a, label: t(`milkAmounts.${a}`) }))}
              />
            </FormField>
          )}
        </div>
      )}

      {drinkConfig?.fields.sweetener && (
        <div className={styles.row}>
          <FormField label={t('orderForm.sweetener')}>
            <Select
              value={form.sweetenerType}
              onChange={(e) =>
                update('sweetenerType', e.target.value as OrderFormData['sweetenerType'])
              }
              options={SWEETENER_TYPES.map((s) => ({ value: s, label: t(`sweetenerTypes.${s}`) }))}
            />
          </FormField>
          {drinkConfig.fields.sweetenerAmount && form.sweetenerType !== 'None' && (
            <FormField label={t('orderForm.howMany')}>
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
        <FormField label={t('orderForm.notes')}>
          <textarea
            className={styles.notes}
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder={t('orderForm.notesPlaceholder')}
            rows={2}
          />
        </FormField>
      )}

      <div className={styles.saveRow}>
        <Checkbox
          label={t('orderForm.saveForLater')}
          checked={saveForLater}
          onChange={(e) => setSaveForLater(e.target.checked)}
        />
      </div>

      {showActions && (
        <div className={styles.row}>
          <Button variant="ghost" type="button" onClick={onCancel}>
            {t('orderForm.cancel')}
          </Button>
          <Button type="submit" fullWidth disabled={!form.drinkType}>
            {submitLabel ?? t('orderForm.addOrder')}
          </Button>
        </div>
      )}
    </form>
  )
}
