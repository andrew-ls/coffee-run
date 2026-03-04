import { ActionCardList } from '@/shared/ui/ActionCardList'
import type { ActiveOrder } from '../model/active-order'
import { ActiveOrderCard } from './ActiveOrderCard'
import styles from './ActiveOrderList.module.css'

interface ActiveOrderListProps {
  orders: ActiveOrder[]
  onToggleDone: (id: string) => void
  onEdit: (id: string) => void
  onRemove: (id: string) => void
  onReorder: (orders: ActiveOrder[]) => void
}

export function ActiveOrderList({
  orders,
  onToggleDone,
  onEdit,
  onRemove,
  onReorder,
}: ActiveOrderListProps) {
  return (
    <div className={styles.list}>
      <ActionCardList
        items={orders}
        onReorder={onReorder}
        renderItem={(order, drag) => (
          <ActiveOrderCard
            order={order}
            onToggleDone={() => onToggleDone(order.id)}
            onEdit={() => onEdit(order.id)}
            onRemove={() => onRemove(order.id)}
            drag={drag}
          />
        )}
        renderOverlay={(order) => (
          <ActiveOrderCard
            order={order}
            onToggleDone={() => {}}
            onEdit={() => {}}
            onRemove={() => {}}
          />
        )}
      />
    </div>
  )
}
