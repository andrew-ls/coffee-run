import { useTranslation } from 'react-i18next'
import type { SavedOrder } from '@/types'
import { SortableList } from '@/components/atoms'
import { SavedOrderCard } from '@/components/molecules'
import styles from './SavedOrderList.module.css'

interface SavedOrderListProps {
  savedOrders: SavedOrder[]
  onUsual: (saved: SavedOrder) => void
  onCustom: (saved: SavedOrder) => void
  onDelete: (savedId: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function SavedOrderList({
  savedOrders,
  onUsual,
  onCustom,
  onDelete,
  onReorder,
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
          <SortableList
            items={savedOrders}
            onReorder={onReorder}
            renderItem={(saved, { dragHandleProps, isDragging }) => (
              <SavedOrderCard
                savedOrder={saved}
                onUsual={onUsual}
                onCustom={onCustom}
                onDelete={onDelete}
                dragHandleProps={dragHandleProps}
                isDragging={isDragging}
              />
            )}
            renderOverlay={(saved) => (
              <SavedOrderCard
                savedOrder={saved}
                onUsual={() => {}}
                onCustom={() => {}}
                onDelete={() => {}}
              />
            )}
          />
        </div>
      )}
    </div>
  )
}
