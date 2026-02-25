import { useTranslation } from 'react-i18next'
import type { SavedOrder } from '@/types'
import { SavedOrderCard } from '@/components/molecules'
import styles from './SavedOrderList.module.css'

interface SavedOrderListProps {
  savedOrders: SavedOrder[]
  onUsual: (saved: SavedOrder) => void
  onCustom: (saved: SavedOrder) => void
  onDelete: (savedId: string) => void
}

export function SavedOrderList({
  savedOrders,
  onUsual,
  onCustom,
  onDelete,
}: SavedOrderListProps) {
  const { t } = useTranslation()

  return (
    <div>
      <div className={styles.title}>{t('savedOrderList.title')}</div>
      {savedOrders.length === 0 ? (
        <div className={styles.empty}>
          {t('savedOrderList.empty')}
        </div>
      ) : (
        <div className={styles.list}>
          {savedOrders.map((saved) => (
            <SavedOrderCard
              key={saved.id}
              savedOrder={saved}
              onUsual={onUsual}
              onCustom={onCustom}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
