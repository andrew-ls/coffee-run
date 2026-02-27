import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { SavedOrder } from '@/types'
import { CheckIcon, DeleteIcon, SlidersIcon } from '@/assets/icons'
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
  const usualCustomContentRef = useRef<HTMLDivElement>(null)
  const deleteContentRef = useRef<HTMLSpanElement>(null)
  const { swipeStyle, touchHandlers, swipeDirection } = useSwipeToDelete({
    enableRightSwipe: true,
    snapRightRef: usualCustomContentRef,
    snapLeftRef: deleteContentRef,
  })

  const { orderData } = savedOrder

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.usualCustomZone}
        style={{ zIndex: swipeDirection === 'right' ? 1 : 0 }}
      >
        <div ref={usualCustomContentRef} className={styles.usualCustomContent}>
          <div onClick={() => onUsual(savedOrder)}>
            {t('savedOrderCard.usual')}
          </div>
          <div onClick={() => onCustom(savedOrder)}>
            {t('savedOrderCard.custom')}
          </div>
        </div>
      </div>
      <div
        className={styles.deleteZone}
        style={{ zIndex: swipeDirection === 'left' ? 1 : 0 }}
        onClick={() => onDelete(savedOrder.id)}
      >
        <span ref={deleteContentRef} className={styles.deleteContent}>{t('savedOrderCard.delete')}</span>
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
            <CheckIcon />
          </IconButton>
          <IconButton variant="custom" label={t('savedOrderCard.custom')} onClick={() => onCustom(savedOrder)}>
            <SlidersIcon />
          </IconButton>
          <IconButton variant="danger" label={t('savedOrderCard.delete')} onClick={() => onDelete(savedOrder.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
