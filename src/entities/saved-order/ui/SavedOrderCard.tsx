import { useTranslation } from 'react-i18next'
import { ActionCard } from '@/shared/ui/ActionCard'
import type { Action, DragBindings } from '@/shared/ui/ActionCard'
import { CheckIcon, SlidersIcon, DeleteIcon } from '@/shared/assets/icons'
import { Pill } from '@/shared/ui/Pill'
import { DRINKS, ASPECT_COLORS } from '@/shared/config'
import type { SavedOrder } from '../model/saved-order'
import styles from './SavedOrderCard.module.css'

const FALLBACK_PILL_COLOR = DRINKS.find((d) => d.type === 'Other')!.pillColor

interface SavedOrderCardProps {
  savedOrder: SavedOrder
  onAdd: () => void
  onCustomise: () => void
  onDelete: () => void
  drag?: DragBindings
}

export function SavedOrderCard({
  savedOrder,
  onAdd,
  onCustomise,
  onDelete,
  drag,
}: SavedOrderCardProps) {
  const { t } = useTranslation()
  const { orderData } = savedOrder

  const drinkColor =
    DRINKS.find((d) => d.type === orderData.drinkType)?.pillColor ?? FALLBACK_PILL_COLOR

  const actions: Action[] = [
    {
      name: t('savedOrderCard.usual'),
      label: t('savedOrderCard.usualSwipe'),
      icon: CheckIcon,
      color: 'mint',
      destructive: false,
      callback: onAdd,
    },
    {
      name: t('savedOrderCard.custom'),
      label: t('savedOrderCard.customSwipe'),
      icon: SlidersIcon,
      color: 'amber',
      destructive: false,
      callback: onCustomise,
    },
    {
      name: t('savedOrderCard.delete'),
      label: t('savedOrderCard.deleteSwipe'),
      icon: DeleteIcon,
      color: 'danger',
      destructive: true,
      callback: onDelete,
    },
  ]

  return (
    <ActionCard actions={actions} drag={drag}>
      <div className={styles.personName}>{orderData.personName}</div>
      <div className={styles.pillRow}>
        <Pill
          label={t(`drinks.${orderData.drinkType}`, orderData.drinkType)}
          color={drinkColor}
        />
        {orderData.iced && (
          <Pill color={ASPECT_COLORS.iced} label={t('orderCard.drinkSummary.iced')} />
        )}
        {orderData.variant && orderData.variant !== 'Other' && (
          <Pill
            color={ASPECT_COLORS.variant}
            label={t(`drinks.variants.${orderData.variant}`, orderData.variant)}
          />
        )}
        {orderData.customVariant && (
          <Pill color={ASPECT_COLORS.variant} label={orderData.customVariant} />
        )}
        {orderData.customDrinkName && (
          <Pill color={ASPECT_COLORS.variant} label={orderData.customDrinkName} />
        )}
        {orderData.milkType && orderData.milkType !== 'None' && (
          <Pill
            color={ASPECT_COLORS.milk}
            label={t('orderCard.drinkSummary.milk', {
              amount: t(`milkAmounts.${orderData.milkAmount}`),
              type: t(`milkTypes.${orderData.milkType}`),
            }).trim()}
          />
        )}
        {orderData.sweetenerType && orderData.sweetenerType !== 'None' && (
          <Pill
            color={ASPECT_COLORS.sweetener}
            label={t('orderCard.drinkSummary.sweetener', {
              amount: orderData.sweetenerAmount,
              type: t(`sweetenerTypes.${orderData.sweetenerType}`),
            })}
          />
        )}
      </div>
    </ActionCard>
  )
}
