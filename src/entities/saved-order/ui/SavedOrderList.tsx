import { useTranslation } from 'react-i18next'
import { ActionCardList } from '@/shared/ui/ActionCardList'
import type { SavedOrder } from '../model/saved-order'
import { SavedOrderCard } from './SavedOrderCard'
import styles from './SavedOrderList.module.css'

interface SavedOrderListProps {
  savedOrders: SavedOrder[]
  onAdd: (saved: SavedOrder) => void
  onCustomise: (saved: SavedOrder) => void
  onDelete: (id: string) => void
  onReorder: (savedOrders: SavedOrder[]) => void
}

export function SavedOrderList({
  savedOrders,
  onAdd,
  onCustomise,
  onDelete,
  onReorder,
}: SavedOrderListProps) {
  const { t } = useTranslation()

  return (
    <div>
      <div className={styles.title}>{t('savedOrderList.title')}</div>
      {savedOrders.length === 0 ? (
        <div className={styles.empty}>{t('savedOrderList.empty')}</div>
      ) : (
        <div className={styles.list}>
          <ActionCardList
            items={savedOrders}
            onReorder={onReorder}
            renderItem={(saved, drag) => (
              <SavedOrderCard
                savedOrder={saved}
                onAdd={() => onAdd(saved)}
                onCustomise={() => onCustomise(saved)}
                onDelete={() => onDelete(saved.id)}
                drag={drag}
              />
            )}
            renderOverlay={(saved) => (
              <SavedOrderCard
                savedOrder={saved}
                onAdd={() => {}}
                onCustomise={() => {}}
                onDelete={() => {}}
              />
            )}
          />
        </div>
      )}
    </div>
  )
}
