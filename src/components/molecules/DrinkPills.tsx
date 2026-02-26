import { useTranslation } from 'react-i18next'
import type { OrderFormData } from '@/types'
import { ASPECT_COLORS, DRINKS } from '@/config'
import { Pill } from '@/components/atoms'

const FALLBACK_PILL_COLOR = DRINKS.find((d) => d.type === 'Other')!.pillColor

interface DrinkPillsProps {
  order: OrderFormData
}

export function DrinkPills({ order }: DrinkPillsProps) {
  const {
    drinkType,
    iced,
    variant,
    customVariant,
    customDrinkName,
    milkType,
    milkAmount,
    sweetenerType,
    sweetenerAmount,
  } = order
  const { t } = useTranslation()

  const drinkColor = DRINKS.find((d) => d.type === drinkType)?.pillColor ?? FALLBACK_PILL_COLOR

  return (
    <>
      <Pill label={drinkType} color={drinkColor} />
      {iced && (
        <Pill color={ASPECT_COLORS.iced} label={t('orderCard.drinkSummary.iced')} />
      )}
      {variant && variant !== 'Other' && (
        <Pill color={ASPECT_COLORS.variant} label={t(`drinks.variants.${variant}`, variant)} />
      )}
      {customVariant && (
        <Pill color={ASPECT_COLORS.variant} label={customVariant} />
      )}
      {customDrinkName && (
        <Pill color={ASPECT_COLORS.variant} label={customDrinkName} />
      )}
      {milkType && milkType !== 'None' && (
        <Pill
          color={ASPECT_COLORS.milk}
          label={t('orderCard.drinkSummary.milk', {
            amount: t(`milkAmounts.${milkAmount}`),
            type: t(`milkTypes.${milkType}`),
          }).trim()}
        />
      )}
      {sweetenerType && sweetenerType !== 'None' && (
        <Pill
          color={ASPECT_COLORS.sweetener}
          label={t('orderCard.drinkSummary.sweetener', {
            amount: sweetenerAmount,
            type: t(`sweetenerTypes.${sweetenerType}`),
          })}
        />
      )}
    </>
  )
}
