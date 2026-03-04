import { useTranslation } from 'react-i18next'
import { ActionCard } from '@/shared/ui/ActionCard'
import type { Action, DragBindings } from '@/shared/ui/ActionCard'
import { CheckIcon, EditIcon, DeleteIcon, UndoIcon } from '@/shared/assets/icons'
import { Pill } from '@/shared/ui/Pill'
import { DRINKS, ASPECT_COLORS } from '@/shared/config'
import type { ActiveOrder } from '../model/active-order'
import styles from './ActiveOrderCard.module.css'

const FALLBACK_PILL_COLOR = DRINKS.find((d) => d.type === 'Other')!.pillColor

interface ActiveOrderCardProps {
  order: ActiveOrder
  onToggleDone: () => void
  onEdit: () => void
  onRemove: () => void
  drag?: DragBindings
}

export function ActiveOrderCard({
  order,
  onToggleDone,
  onEdit,
  onRemove,
  drag,
}: ActiveOrderCardProps) {
  const { t } = useTranslation()

  const drinkColor =
    DRINKS.find((d) => d.type === order.drinkType)?.pillColor ?? FALLBACK_PILL_COLOR

  const actions: Action[] = order.done
    ? [
        {
          name: t('activeOrderCard.undoLabel'),
          label: t('activeOrderCard.undo'),
          icon: UndoIcon,
          color: 'default',
          destructive: false,
          callback: onToggleDone,
        },
      ]
    : [
        {
          name: t('activeOrderCard.doneLabel'),
          label: t('activeOrderCard.done'),
          icon: CheckIcon,
          color: 'mint',
          destructive: false,
          callback: onToggleDone,
        },
        {
          name: t('activeOrderCard.editLabel'),
          label: t('activeOrderCard.edit'),
          icon: EditIcon,
          color: 'amber',
          destructive: false,
          callback: onEdit,
        },
        {
          name: t('activeOrderCard.removeLabel'),
          label: t('activeOrderCard.remove'),
          icon: DeleteIcon,
          color: 'danger',
          destructive: true,
          callback: onRemove,
        },
      ]

  return (
    <ActionCard actions={actions} drag={drag} className={order.done ? styles.done : undefined}>
      <div className={styles.personName}>{order.personName}</div>
      <div className={styles.pillRow}>
        <Pill label={t(`drinks.${order.drinkType}`, order.drinkType)} color={drinkColor} />
        {order.iced && (
          <Pill color={ASPECT_COLORS.iced} label={t('orderCard.drinkSummary.iced')} />
        )}
        {order.variant && order.variant !== 'Other' && (
          <Pill
            color={ASPECT_COLORS.variant}
            label={t(`drinks.variants.${order.variant}`, order.variant)}
          />
        )}
        {order.customVariant && (
          <Pill color={ASPECT_COLORS.variant} label={order.customVariant} />
        )}
        {order.customDrinkName && (
          <Pill color={ASPECT_COLORS.variant} label={order.customDrinkName} />
        )}
        {order.milkType && order.milkType !== 'None' && (
          <Pill
            color={ASPECT_COLORS.milk}
            label={t('orderCard.drinkSummary.milk', {
              amount: t(`milkAmounts.${order.milkAmount}`),
              type: t(`milkTypes.${order.milkType}`),
            }).trim()}
          />
        )}
        {order.sweetenerType && order.sweetenerType !== 'None' && (
          <Pill
            color={ASPECT_COLORS.sweetener}
            label={t('orderCard.drinkSummary.sweetener', {
              amount: order.sweetenerAmount,
              type: t(`sweetenerTypes.${order.sweetenerType}`),
            })}
          />
        )}
      </div>
    </ActionCard>
  )
}
