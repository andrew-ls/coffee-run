import { useTranslation } from 'react-i18next'
import type { SavedOrder } from '@/types'
import { Button } from '@/components/atoms'
import { SavedOrderList } from '@/components/organisms'
import styles from './AddOrder.module.css'

interface AddOrderProps {
  savedOrders: SavedOrder[]
  onNewOrder: () => void
  onUsual: (saved: SavedOrder) => void
  onCustom: (saved: SavedOrder) => void
  onDeleteSaved: (savedId: string) => void
  onReorderSaved: (fromIndex: number, toIndex: number) => void
  onBack: () => void
  showBack?: boolean
}

export function AddOrder({
  savedOrders,
  onNewOrder,
  onUsual,
  onCustom,
  onDeleteSaved,
  onReorderSaved,
  onBack,
  showBack = true,
}: AddOrderProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{t('addOrder.title')}</div>
        {showBack && (
          <Button variant="ghost" onClick={onBack}>
            {t('addOrder.back')}
          </Button>
        )}
      </div>
      <div className={styles.newOrderSection}>
        <Button onClick={onNewOrder} fullWidth>
          {t('addOrder.newOrder')}
        </Button>
      </div>
      <SavedOrderList
        savedOrders={savedOrders}
        onUsual={onUsual}
        onCustom={onCustom}
        onDelete={onDeleteSaved}
        onReorder={onReorderSaved}
      />
    </div>
  )
}
