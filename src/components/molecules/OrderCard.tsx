import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { Order, SavedOrder } from '@/types'
import { CheckIcon, DeleteIcon, EditIcon, SlidersIcon } from '@/shared/assets/icons'
import { DragHandle } from '@/shared/ui/DragHandle'
import { IconButton } from '@/shared/ui/IconButton'
import { useSwipe } from '@/shared/ui/ActionCard'
import { DrinkPills } from './DrinkPills'
import styles from './OrderCard.module.css'

type OrderCardActiveProps = {
  mode: 'active'
  order: Order
  onEdit: (orderId: string) => void
  onDelete: (orderId: string) => void
  isNew?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
  isDragging?: boolean
}

type OrderCardSavedProps = {
  mode: 'saved'
  savedOrder: SavedOrder
  onUsual: (savedOrder: SavedOrder) => void
  onCustom: (savedOrder: SavedOrder) => void
  onDelete: (savedId: string) => void
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
  isDragging?: boolean
}

type OrderCardProps = OrderCardActiveProps | OrderCardSavedProps

export function OrderCard(props: OrderCardProps) {
  const { t } = useTranslation()
  const rightZoneRef = useRef<HTMLElement>(null)
  const deleteZoneRef = useRef<HTMLSpanElement>(null)
  const { swipeStyle, touchHandlers, swipeDirection } = useSwipe({
    enableRightSwipe: true,
    snapRightRef: rightZoneRef,
    snapLeftRef: deleteZoneRef,
  })

  const orderData = props.mode === 'active' ? props.order : props.savedOrder.orderData
  const { dragHandleProps, isDragging } = props
  const deleteId = props.mode === 'active' ? props.order.id : props.savedOrder.id
  const deleteLabel = t(props.mode === 'active' ? 'orderCard.delete' : 'savedOrderCard.delete')
  const isNew = props.mode === 'active' && props.isNew

  const rightZone = props.mode === 'active' ? (
    <div
      className={styles.editZone}
      style={{ zIndex: swipeDirection === 'right' ? 1 : 0 }}
      onClick={() => props.onEdit(props.order.id)}
    >
      <span ref={rightZoneRef as React.RefObject<HTMLSpanElement>} className={styles.zoneContent}>
        {t('orderCard.edit')}
      </span>
    </div>
  ) : (
    <div
      className={styles.usualCustomZone}
      style={{ zIndex: swipeDirection === 'right' ? 1 : 0 }}
    >
      <div ref={rightZoneRef as React.RefObject<HTMLDivElement>} className={styles.usualCustomContent}>
        <div onClick={() => props.onUsual(props.savedOrder)}>{t('savedOrderCard.usual')}</div>
        <div onClick={() => props.onCustom(props.savedOrder)}>{t('savedOrderCard.custom')}</div>
      </div>
    </div>
  )

  const actionButtons = props.mode === 'active' ? (
    <>
      <IconButton label={t('orderCard.editLabel')} variant="amber" onClick={() => props.onEdit(props.order.id)}>
        <EditIcon />
      </IconButton>
      <IconButton label={t('orderCard.deleteLabel')} variant="danger" onClick={() => props.onDelete(props.order.id)}>
        <DeleteIcon />
      </IconButton>
    </>
  ) : (
    <>
      <IconButton variant="mint" label={t('savedOrderCard.usual')} onClick={() => props.onUsual(props.savedOrder)}>
        <CheckIcon />
      </IconButton>
      <IconButton variant="amber" label={t('savedOrderCard.custom')} onClick={() => props.onCustom(props.savedOrder)}>
        <SlidersIcon />
      </IconButton>
      <IconButton variant="danger" label={t('savedOrderCard.delete')} onClick={() => props.onDelete(props.savedOrder.id)}>
        <DeleteIcon />
      </IconButton>
    </>
  )

  return (
    <div className={styles.wrapper}>
      {rightZone}
      <div
        className={styles.deleteZone}
        style={{ zIndex: swipeDirection === 'left' ? 1 : 0 }}
        onClick={() => props.onDelete(deleteId)}
      >
        <span ref={deleteZoneRef} className={styles.zoneContent}>{deleteLabel}</span>
      </div>
      <div
        className={`${styles.card}${isNew ? ` ${styles.entering}` : ''}${isDragging ? ` ${styles.dragging}` : ''}`}
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
        <div className={styles.actions}>{actionButtons}</div>
      </div>
    </div>
  )
}
