import { useRef } from 'react'
import type { Order } from '@/types'
import { OrderCard } from '@/components/molecules'
import styles from './OrderList.module.css'

interface OrderListProps {
  orders: Order[]
  onEdit: (orderId: string) => void
  onDelete: (orderId: string) => void
}

export function OrderList({ orders, onEdit, onDelete }: OrderListProps) {
  const prevCount = useRef(orders.length)
  const isNewOrder = orders.length > prevCount.current
  prevCount.current = orders.length
  const newestId = isNewOrder ? orders[orders.length - 1]?.id : null

  return (
    <div className={styles.list}>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onEdit={onEdit}
          onDelete={onDelete}
          isNew={order.id === newestId}
        />
      ))}
    </div>
  )
}
