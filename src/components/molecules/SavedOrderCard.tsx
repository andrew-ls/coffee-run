import { useTranslation } from 'react-i18next'
import type { SavedOrder } from '@/types'
import { Button, DragHandle } from '@/components/atoms'
import { useSwipeToDelete } from '@/hooks'
import { DrinkPills } from './DrinkPills'
import styles from './SavedOrderCard.module.css'

interface SavedOrderCardProps {
  savedOrder: SavedOrder
  onUsual: (savedOrder: SavedOrder) => void
  onCustom: (savedOrder: SavedOrder) => void
  onDelete: (savedId: string) => void
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
  isDragging?: boolean
}

export function SavedOrderCard({
  savedOrder,
  onUsual,
  onCustom,
  onDelete,
  dragHandleProps,
  isDragging,
}: SavedOrderCardProps) {
  const { t } = useTranslation()
  const { swipeStyle, touchHandlers } = useSwipeToDelete()

  const { orderData } = savedOrder

  return (
    <div className={styles.wrapper}>
      <div className={styles.deleteZone} onClick={() => onDelete(savedOrder.id)}>
        {t('savedOrderCard.delete')}
      </div>
      <div
        className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
        style={swipeStyle}
        {...touchHandlers}
      >
        <DragHandle {...dragHandleProps} />
        <div className={styles.info}>
          <div className={styles.personName}>{orderData.personName}</div>
          <div className={styles.pillRow}>
            <DrinkPills order={orderData} />
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => onUsual(savedOrder)}>
            {t('savedOrderCard.usual')}
          </Button>
          <Button variant="ghost" onClick={() => onCustom(savedOrder)}>
            {t('savedOrderCard.custom')}
          </Button>
        </div>
      </div>
    </div>
  )
}
