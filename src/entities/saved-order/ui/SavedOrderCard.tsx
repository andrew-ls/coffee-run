import { useTranslation } from 'react-i18next'
import { ActionCard } from '@/shared/ui/ActionCard'
import type { Action, DragBindings } from '@/shared/ui/ActionCard'
import { CheckIcon, SlidersIcon, DeleteIcon } from '@/shared/assets/icons'
import { DrinkPills } from '@/shared/ui/DrinkPills'
import type { SavedOrder } from '../model/saved-order'
import styles from './SavedOrderCard.module.css'

interface SavedOrderCardProps {
  savedOrder: SavedOrder
  onAdd: () => void
  onCustomised: () => void
  onDelete: () => void
  drag?: DragBindings
}

export function SavedOrderCard({
  savedOrder,
  onAdd,
  onCustomised,
  onDelete,
  drag,
}: SavedOrderCardProps) {
  const { t } = useTranslation()
  const { orderData } = savedOrder

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
      callback: onCustomised,
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
        <DrinkPills order={orderData} />
      </div>
    </ActionCard>
  )
}
