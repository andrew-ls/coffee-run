import { useState, useMemo } from 'react'
import type { Order } from '@/types'
import { Button } from '@/components/atoms'
import { ConfirmDialog } from '@/components/molecules'
import { RunHeader, OrderList, Mascot } from '@/components/organisms'
import styles from './RunView.module.css'

const EMPTY_MESSAGES = [
  "The kettle's gone cold...",
  "Nobody's thirsty?",
  "Bit quiet in here...",
  "Who fancies a brew?",
  "The mugs are gathering dust...",
]

interface RunViewProps {
  hasActiveRun: boolean
  orders: Order[]
  onStartRun: () => void
  onEndRun: () => void
  onAddOrder: () => void
  onEditOrder: (orderId: string) => void
  onDeleteOrder: (orderId: string) => void
  showHeader?: boolean
  showAddButton?: boolean
}

export function RunView({
  hasActiveRun,
  orders,
  onStartRun,
  onEndRun,
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
  showHeader = true,
  showAddButton = true,
}: RunViewProps) {
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const emptyMessage = useMemo(
    () => EMPTY_MESSAGES[Math.floor(Math.random() * EMPTY_MESSAGES.length)],
    [],
  )

  const header = (
    <RunHeader
      orderCount={orders.length}
      hasActiveRun={hasActiveRun}
      onEndRun={() => setShowEndConfirm(true)}
    />
  )

  if (!hasActiveRun) {
    return (
      <>
        {showHeader && header}
        <div className={styles.emptyState}>
          <Mascot orderCount={0} message={emptyMessage} />
          <div className={styles.startButton}>
            <Button onClick={onStartRun}>Start a brew round</Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {showHeader && header}
      <div className={styles.container}>
        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <Mascot orderCount={0} message={emptyMessage} />
          </div>
        ) : (
          <>
            <Mascot orderCount={orders.length} />
            <OrderList
              orders={orders}
              onEdit={onEditOrder}
              onDelete={(id) => setDeleteConfirm(id)}
            />
          </>
        )}
      </div>
      {showAddButton && (
        <button className={styles.addButton} onClick={onAddOrder} aria-label="Add order">
          +
        </button>
      )}
      {showEndConfirm && (
        <ConfirmDialog
          title="End this round?"
          message="Everyone sorted? This will clear all current orders."
          confirmLabel="End round"
          onConfirm={() => {
            setShowEndConfirm(false)
            onEndRun()
          }}
          onCancel={() => setShowEndConfirm(false)}
        />
      )}
      {deleteConfirm && (
        <ConfirmDialog
          title="Remove this order?"
          message="Are you sure you want to bin this one?"
          confirmLabel="Remove"
          onConfirm={() => {
            onDeleteOrder(deleteConfirm)
            setDeleteConfirm(null)
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  )
}
