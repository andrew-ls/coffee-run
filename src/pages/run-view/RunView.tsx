import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActiveOrderList } from '@/entities/active-order'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { Mascot } from '@/widgets/mascot'
import { useRunContext } from '@/app/contexts/RunContext'
import { useActiveOrderContext } from '@/app/contexts/ActiveOrderContext'
import styles from './RunView.module.css'

interface RunViewProps {
  onStartRun: () => void
  onEditOrder: (orderId: string) => void
}

export function RunView({ onStartRun, onEditOrder }: RunViewProps) {
  const { t } = useTranslation()
  const { activeRun } = useRunContext()
  const { orders, toggleDone, removeOrder, reorderOrders } = useActiveOrderContext()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [emptyMessage] = useState(() => {
    const messages = t('runView.emptyMessages', { returnObjects: true }) as string[]
    return messages[Math.floor(Math.random() * messages.length)]
  })

  if (!activeRun) {
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
              onToggleDone={toggleDone}
              onEdit={onEditOrder}
              onRemove={(id) => setDeleteConfirm(id)}
              onReorder={reorderOrders}
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
            removeOrder(deleteConfirm)
            setDeleteConfirm(null)
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  )
}
