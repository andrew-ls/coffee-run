import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SavedOrder } from '@/entities/saved-order'
import { SavedOrderList } from '@/entities/saved-order'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import styles from './AddOrder.module.css'

interface AddOrderProps {
  savedOrders: SavedOrder[]
  onNewOrder: () => void
  onUsual: (saved: SavedOrder) => void
  onCustom: (saved: SavedOrder) => void
  onDeleteSaved: (savedId: string) => void
  onReorderSaved: (reordered: SavedOrder[]) => void
}

export function AddOrder({
  savedOrders,
  onNewOrder,
  onUsual,
  onCustom,
  onDeleteSaved,
  onReorderSaved,
}: AddOrderProps) {
  const { t } = useTranslation()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleConfirmDelete = () => {
    onDeleteSaved(deleteConfirmId!)
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
        onReorder={onReorderSaved}
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
