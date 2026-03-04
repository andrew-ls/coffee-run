import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ActiveOrder } from '@/entities/active-order'
import { ActiveOrderList } from '@/entities/active-order'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { Mascot } from '@/components/organisms'
import styles from './RunView.module.css'

interface RunViewProps {
  hasActiveRun: boolean
  orders: ActiveOrder[]
  onStartRun: () => void
  onToggleDone: (orderId: string) => void
  onEditOrder: (orderId: string) => void
  onDeleteOrder: (orderId: string) => void
  onReorderOrder: (orders: ActiveOrder[]) => void
}

export function RunView({
  hasActiveRun,
  orders,
  onStartRun,
  onToggleDone,
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
            <ActiveOrderList
              orders={orders}
              onToggleDone={onToggleDone}
              onEdit={onEditOrder}
              onRemove={(id) => setDeleteConfirm(id)}
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
