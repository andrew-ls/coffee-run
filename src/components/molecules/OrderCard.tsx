import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { Order } from '@/types'
import { DragHandle, IconButton } from '@/components/atoms'
import { useSwipeToDelete } from '@/hooks'
import { DrinkPills } from './DrinkPills'
import styles from './OrderCard.module.css'

interface OrderCardProps {
  order: Order
  onEdit: (orderId: string) => void
  onDelete: (orderId: string) => void
  isNew?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
  isDragging?: boolean
}

export function OrderCard({ order, onEdit, onDelete, isNew, dragHandleProps, isDragging }: OrderCardProps) {
  const { t } = useTranslation()
  const editZoneRef = useRef<HTMLSpanElement>(null)
  const deleteZoneRef = useRef<HTMLSpanElement>(null)
  const { swipeStyle, touchHandlers, swipeDirection } = useSwipeToDelete({
    enableRightSwipe: true,
    snapRightRef: editZoneRef,
    snapLeftRef: deleteZoneRef,
  })

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.editZone}
        style={{ zIndex: swipeDirection === 'right' ? 1 : 0 }}
        onClick={() => onEdit(order.id)}
      >
        <span ref={editZoneRef} className={styles.zoneContent}>{t('orderCard.edit')}</span>
      </div>
      <div
        className={styles.deleteZone}
        style={{ zIndex: swipeDirection === 'left' ? 1 : 0 }}
        onClick={() => onDelete(order.id)}
      >
        <span ref={deleteZoneRef} className={styles.zoneContent}>{t('orderCard.delete')}</span>
      </div>
      <div
        className={`${styles.card} ${isNew ? styles.entering : ''} ${isDragging ? styles.dragging : ''}`}
        style={swipeStyle}
        {...touchHandlers}
      >
        <DragHandle {...dragHandleProps} />
        <div className={styles.info}>
          <div className={styles.personName}>{order.personName}</div>
          <div className={styles.pillRow}>
            <DrinkPills order={order} />
          </div>
        </div>
        <div className={styles.actions}>
          <IconButton label={t('orderCard.editLabel')} onClick={() => onEdit(order.id)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
          <IconButton
            label={t('orderCard.deleteLabel')}
            variant="danger"
            onClick={() => onDelete(order.id)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4H14M5 4V2H11V4M6 7V12M10 7V12M3 4L4 14H12L13 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
        </div>
      </div>
    </div>
  )
}
