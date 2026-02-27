import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Order } from '@/types'
import { Button } from '@/components/atoms'
import { ConfirmDialog } from '@/components/molecules'
import { OrderList, Mascot } from '@/components/organisms'
import styles from './RunView.module.css'

interface RunViewProps {
  hasActiveRun: boolean
  orders: Order[]
  onStartRun: () => void
  onEditOrder: (orderId: string) => void
  onDeleteOrder: (orderId: string) => void
  onReorderOrder: (fromIndex: number, toIndex: number) => void
}

export function RunView({
  hasActiveRun,
  orders,
  onStartRun,
  onEditOrder,
  onDeleteOrder,
  onReorderOrder,
}: RunViewProps) {
  const { t } = useTranslation()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [emptyMessage] = useState(() => {
    const messages = t('runView.emptyMessages', { returnObjects: true }) as string[]
    return messages[Math.floor(Math.random() * messages.length)]
  })

  if (!hasActiveRun) {
    return (
      <div className={styles.emptyState}>
        <Mascot orderCount={0} message={emptyMessage} />
        <div className={styles.startButton}>
          <Button onClick={onStartRun}>{t('runView.startRun')}</Button>
        </div>
      </div>
    )
  }

  return (
    <>
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
              onReorder={onReorderOrder}
            />
          </>
        )}
      </div>
      {deleteConfirm && (
        <ConfirmDialog
          title={t('runView.deleteOrderDialog.title')}
          message={t('runView.deleteOrderDialog.message')}
          confirmLabel={t('runView.deleteOrderDialog.confirm')}
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
