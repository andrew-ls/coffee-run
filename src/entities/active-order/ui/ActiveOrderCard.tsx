import { useTranslation } from 'react-i18next'
import { ActionCard } from '@/shared/ui/ActionCard'
import type { Action, DragBindings } from '@/shared/ui/ActionCard'
import { CheckIcon, EditIcon, DeleteIcon, UndoIcon } from '@/shared/assets/icons'
import { DrinkPills } from '@/shared/ui/DrinkPills'
import type { ActiveOrder } from '../model/active-order'
import styles from './ActiveOrderCard.module.css'

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
        <DrinkPills order={order} />
      </div>
    </ActionCard>
  )
}
