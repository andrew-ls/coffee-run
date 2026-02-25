import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Order } from '@/types'
import { Button } from '@/components/atoms'
import { ConfirmDialog } from '@/components/molecules'
import { RunHeader, OrderList, Mascot } from '@/components/organisms'
import styles from './RunView.module.css'

interface RunViewProps {
  hasActiveRun: boolean
  orders: Order[]
  onStartRun: () => void
  onEndRun: () => void
  onAddOrder: () => void
  onEditOrder: (orderId: string) => void
  onDeleteOrder: (orderId: string) => void
  onReorderOrder: (fromIndex: number, toIndex: number) => void
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
  onReorderOrder,
  showHeader = true,
  showAddButton = true,
}: RunViewProps) {
  const { t } = useTranslation()
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const emptyMessage = useMemo(() => {
    const messages = t('runView.emptyMessages', { returnObjects: true }) as string[]
    return messages[Math.floor(Math.random() * messages.length)]
  }, [t])

  const header = (
    <RunHeader
      orderCount={orders.length}
      hasActiveRun={hasActiveRun}
    />
  )

  if (!hasActiveRun) {
    return (
      <>
        {showHeader && header}
        <div className={styles.emptyState}>
          <Mascot orderCount={0} message={emptyMessage} />
          <div className={styles.startButton}>
            <Button onClick={onStartRun}>{t('runView.startRun')}</Button>
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
              onReorder={onReorderOrder}
            />
          </>
        )}
      </div>
      <div className={styles.bottomBar}>
        <Button variant="text" onClick={() => setShowEndConfirm(true)}>
          {t('runHeader.endRun')}
        </Button>
        {showAddButton && (
          <button
            className={styles.fab}
            onClick={onAddOrder}
            aria-label={t('runView.addOrderAriaLabel')}
          >
            +
          </button>
        )}
      </div>
      {showEndConfirm && (
        <ConfirmDialog
          title={t('runView.endRoundDialog.title')}
          message={t('runView.endRoundDialog.message')}
          confirmLabel={t('runView.endRoundDialog.confirm')}
          onConfirm={() => {
            setShowEndConfirm(false)
            onEndRun()
          }}
          onCancel={() => setShowEndConfirm(false)}
        />
      )}
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
