import { useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { SavedOrder } from '@/types'
import { Badge, Button } from '@/components/atoms'
import { useBreakpoint } from '@/hooks'
import styles from './SavedOrderCard.module.css'

interface SavedOrderCardProps {
  savedOrder: SavedOrder
  onUsual: (savedOrder: SavedOrder) => void
  onCustom: (savedOrder: SavedOrder) => void
  onDelete: (savedId: string) => void
}

const SWIPE_THRESHOLD = 80

export function SavedOrderCard({
  savedOrder,
  onUsual,
  onCustom,
  onDelete,
}: SavedOrderCardProps) {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()
  const startX = useRef(0)
  const [offsetX, setOffsetX] = useState(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - startX.current
    if (diff < 0) setOffsetX(diff)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (offsetX < -SWIPE_THRESHOLD) {
      setOffsetX(-SWIPE_THRESHOLD - 20)
    } else {
      setOffsetX(0)
    }
  }, [offsetX])

  const { orderData } = savedOrder

  return (
    <div className={styles.wrapper}>
      <div className={styles.deleteZone} onClick={() => onDelete(savedOrder.id)}>
        {t('savedOrderCard.delete')}
      </div>
      <div
        className={styles.card}
        style={
          breakpoint === 'mobile'
            ? { transform: `translateX(${offsetX}px)` }
            : undefined
        }
        onTouchStart={breakpoint === 'mobile' ? handleTouchStart : undefined}
        onTouchMove={breakpoint === 'mobile' ? handleTouchMove : undefined}
        onTouchEnd={breakpoint === 'mobile' ? handleTouchEnd : undefined}
      >
        <Badge drinkType={orderData.drinkType} />
        <div className={styles.info}>
          <div className={styles.personName}>{orderData.personName}</div>
          <div className={styles.drinkSummary}>
            {orderData.variant || orderData.customDrinkName || orderData.drinkType}
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
