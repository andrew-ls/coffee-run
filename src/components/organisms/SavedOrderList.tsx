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
  return (
    <div>
      <div className={styles.title}>Saved Orders</div>
      {savedOrders.length === 0 ? (
        <div className={styles.empty}>
          No saved orders yet. Save one from the order form!
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
