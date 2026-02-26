import { useTranslation } from 'react-i18next'
import type { SavedOrder } from '@/types'
import { DragHandle, IconButton } from '@/components/atoms'
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
  const { swipeStyle, touchHandlers, swipeDirection } = useSwipeToDelete({ enableRightSwipe: true })

  const { orderData } = savedOrder

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.usualCustomZone}
        style={{ zIndex: swipeDirection === 'right' ? 1 : 0 }}
      >
        <div className={styles.usualZone} onClick={() => onUsual(savedOrder)}>
          {t('savedOrderCard.usual')}
        </div>
        <div className={styles.customZone} onClick={() => onCustom(savedOrder)}>
          {t('savedOrderCard.custom')}
        </div>
      </div>
      <div
        className={styles.deleteZone}
        style={{ zIndex: swipeDirection === 'left' ? 1 : 0 }}
        onClick={() => onDelete(savedOrder.id)}
      >
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
          <IconButton variant="usual" label={t('savedOrderCard.usual')} onClick={() => onUsual(savedOrder)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8L6 12L14 4" />
            </svg>
          </IconButton>
          <IconButton variant="custom" label={t('savedOrderCard.custom')} onClick={() => onCustom(savedOrder)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="2" y1="4" x2="14" y2="4" />
              <line x1="2" y1="8" x2="14" y2="8" />
              <line x1="2" y1="12" x2="14" y2="12" />
              <circle cx="10" cy="4" r="2" stroke="currentColor" fill="var(--color-bg-card)" />
              <circle cx="5" cy="8" r="2" stroke="currentColor" fill="var(--color-bg-card)" />
              <circle cx="11" cy="12" r="2" stroke="currentColor" fill="var(--color-bg-card)" />
            </svg>
          </IconButton>
          <IconButton variant="danger" label={t('savedOrderCard.delete')} onClick={() => onDelete(savedOrder.id)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4H14M5 4V2H11V4M6 7V12M10 7V12M3 4L4 14H12L13 4" />
            </svg>
          </IconButton>
        </div>
      </div>
    </div>
  )
}
