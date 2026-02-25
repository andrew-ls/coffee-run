import { useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { Order } from '@/types'
import { Badge, DragHandle, IconButton } from '@/components/atoms'
import { useBreakpoint } from '@/hooks'
import styles from './OrderCard.module.css'

interface OrderCardProps {
  order: Order
  onEdit: (orderId: string) => void
  onDelete: (orderId: string) => void
  isNew?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLElement>
  isDragging?: boolean
}

function buildDrinkSummary(order: Order, t: TFunction): string {
  const parts: string[] = []
  if (order.iced) parts.push(t('orderCard.drinkSummary.iced'))
  if (order.variant) parts.push(t(`drinks.variants.${order.variant}`, order.variant))
  if (order.customVariant) parts.push(order.customVariant)
  if (order.customDrinkName) parts.push(order.customDrinkName)
  if (order.milkType && order.milkType !== 'None') {
    parts.push(
      t('orderCard.drinkSummary.milk', {
        amount: t(`milkAmounts.${order.milkAmount ?? ''}`),
        type: t(`milkTypes.${order.milkType}`),
      }).trim(),
    )
  }
  if (order.sweetenerType && order.sweetenerType !== 'None') {
    parts.push(
      t('orderCard.drinkSummary.sweetener', {
        amount: order.sweetenerAmount,
        type: t(`sweetenerTypes.${order.sweetenerType}`),
      }),
    )
  }
  if (order.notes) parts.push(`"${order.notes}"`)
  return parts.join(' · ') || t(`drinks.${order.drinkType}`, order.drinkType)
}

const SWIPE_THRESHOLD = 80

export function OrderCard({ order, onEdit, onDelete, isNew, dragHandleProps, isDragging }: OrderCardProps) {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const currentX = useRef(0)
  const [offsetX, setOffsetX] = useState(0)
  const [swiped, setSwiped] = useState(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX
    const diff = currentX.current - startX.current
    if (diff < 0) {
      setOffsetX(diff)
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (offsetX < -SWIPE_THRESHOLD) {
      setSwiped(true)
      setOffsetX(-SWIPE_THRESHOLD - 20)
    } else {
      setOffsetX(0)
    }
  }, [offsetX])

  const handleSwipeDelete = useCallback(() => {
    onDelete(order.id)
  }, [onDelete, order.id])

  return (
    <div className={styles.wrapper}>
      <div className={styles.deleteZone} onClick={handleSwipeDelete}>
        {t('orderCard.delete')}
      </div>
      <div
        ref={cardRef}
        className={`${styles.card} ${isNew ? styles.entering : ''} ${isDragging ? styles.dragging : ''}`}
        style={
          breakpoint === 'mobile'
            ? { transform: `translateX(${offsetX}px)` }
            : undefined
        }
        onTouchStart={breakpoint === 'mobile' ? handleTouchStart : undefined}
        onTouchMove={breakpoint === 'mobile' ? handleTouchMove : undefined}
        onTouchEnd={breakpoint === 'mobile' ? handleTouchEnd : undefined}
      >
        <DragHandle {...dragHandleProps} />
        <Badge drinkType={order.drinkType} />
        <div className={styles.info}>
          <div className={styles.personName}>{order.personName}</div>
          <div className={styles.drinkSummary}>{buildDrinkSummary(order, t)}</div>
        </div>
        <div
          className={`${styles.actions} ${breakpoint === 'mobile' || swiped ? styles.actionsVisible : ''}`}
        >
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
