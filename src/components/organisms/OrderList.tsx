import { useRef } from 'react'
import type { Order } from '@/types'
import { SortableList } from '@/components/atoms'
import { OrderCard } from '@/components/molecules'
import styles from './OrderList.module.css'

interface OrderListProps {
  orders: Order[]
  onEdit: (orderId: string) => void
  onDelete: (orderId: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function OrderList({ orders, onEdit, onDelete, onReorder }: OrderListProps) {
  const prevCount = useRef(orders.length)
  const isNewOrder = orders.length > prevCount.current
  prevCount.current = orders.length
  const newestId = isNewOrder ? orders[orders.length - 1]?.id : null

  return (
    <div className={styles.list}>
      <SortableList
        items={orders}
        onReorder={onReorder}
        renderItem={(order, { dragHandleProps, isDragging }) => (
          <OrderCard
            order={order}
            onEdit={onEdit}
            onDelete={onDelete}
            isNew={order.id === newestId}
            dragHandleProps={dragHandleProps}
            isDragging={isDragging}
          />
        )}
        renderOverlay={(order) => (
          <OrderCard order={order} onEdit={() => {}} onDelete={() => {}} />
        )}
      />
    </div>
  )
}
