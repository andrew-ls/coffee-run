import { useTranslation } from 'react-i18next'
import type { OrderFormData } from '@/types'
import { AspectPill, Badge } from '@/components/atoms'

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

  return (
    <>
      <Badge drinkType={drinkType} />
      {iced && (
        <AspectPill category="iced" label={t('orderCard.drinkSummary.iced')} />
      )}
      {variant && variant !== 'Other' && (
        <AspectPill category="variant" label={t(`drinks.variants.${variant}`, variant)} />
      )}
      {customVariant && (
        <AspectPill category="variant" label={customVariant} />
      )}
      {customDrinkName && (
        <AspectPill category="variant" label={customDrinkName} />
      )}
      {milkType && milkType !== 'None' && (
        <AspectPill
          category="milk"
          label={t('orderCard.drinkSummary.milk', {
            amount: t(`milkAmounts.${milkAmount}`),
            type: t(`milkTypes.${milkType}`),
          }).trim()}
        />
      )}
      {sweetenerType && sweetenerType !== 'None' && (
        <AspectPill
          category="sweetener"
          label={t('orderCard.drinkSummary.sweetener', {
            amount: sweetenerAmount,
            type: t(`sweetenerTypes.${sweetenerType}`),
          })}
        />
      )}
    </>
  )
}
