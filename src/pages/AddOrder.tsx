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
  onBack: () => void
  showBack?: boolean
}

export function AddOrder({
  savedOrders,
  onNewOrder,
  onUsual,
  onCustom,
  onDeleteSaved,
  onBack,
  showBack = true,
}: AddOrderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Add Order</div>
        {showBack && (
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        )}
      </div>
      <div className={styles.newOrderSection}>
        <Button onClick={onNewOrder} fullWidth>
          New Order
        </Button>
      </div>
      <SavedOrderList
        savedOrders={savedOrders}
        onUsual={onUsual}
        onCustom={onCustom}
        onDelete={onDeleteSaved}
      />
    </div>
  )
}
