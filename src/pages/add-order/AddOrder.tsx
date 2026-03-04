import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SavedOrder } from '@/entities/saved-order'
import { SavedOrderList } from '@/entities/saved-order'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { useSavedOrderContext } from '@/app/contexts/SavedOrderContext'
import styles from './AddOrder.module.css'

interface AddOrderProps {
  onNewOrder: () => void
  onUsual: (saved: SavedOrder) => void
  onCustom: (saved: SavedOrder) => void
}

export function AddOrder({ onNewOrder, onUsual, onCustom }: AddOrderProps) {
  const { t } = useTranslation()
  const { savedOrders, removeSavedOrder, reorderSavedOrders } = useSavedOrderContext()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleConfirmDelete = () => {
    removeSavedOrder(deleteConfirmId!)
    setDeleteConfirmId(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{t('addOrder.title')}</div>
      </div>
      <div className={styles.newOrderSection}>
        <Button onClick={onNewOrder} fullWidth>
          {t('addOrder.newOrder')}
        </Button>
      </div>
      <SavedOrderList
        savedOrders={savedOrders}
        onAdd={(id) => {
          const saved = savedOrders.find((s) => s.id === id)
          if (saved) onUsual(saved)
        }}
        onCustomise={(id) => {
          const saved = savedOrders.find((s) => s.id === id)
          if (saved) onCustom(saved)
        }}
        onDelete={setDeleteConfirmId}
        onReorder={reorderSavedOrders}
      />
      {deleteConfirmId && (
        <ConfirmDialog
          title={t('addOrder.deleteSavedDialog.title')}
          message={t('addOrder.deleteSavedDialog.message')}
          confirmLabel={t('addOrder.deleteSavedDialog.confirm')}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  )
}
