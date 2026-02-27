import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { OrderFormData, SavedOrder } from '@/types'
import { useRun, useOrders, useSavedOrders, useBreakpoint } from '@/hooks'
import { SinglePanelLayout } from '@/components/templates/SinglePanelLayout'
import { DualPanelLayout } from '@/components/templates/DualPanelLayout'
import { Button } from '@/components/atoms'
import { ConfirmDialog } from '@/components/molecules'
import { RunHeader, BottomAppBar, Fab } from '@/components/organisms'
import { RunView } from '@/pages/RunView'
import { AddOrder } from '@/pages/AddOrder'
import { OrderFormPage } from '@/pages/OrderFormPage'
import styles from './App.module.css'

type Screen =
  | { name: 'run' }
  | { name: 'add' }
  | { name: 'form'; orderId?: string; prefill?: Partial<OrderFormData> }

export default function App() {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()
  const { activeRun, startRun, archiveRun } = useRun()
  const { orders, addOrder, updateOrder, removeOrder, reorderOrders } = useOrders(activeRun?.id ?? null)
  const { savedOrders, saveOrder, removeSavedOrder, reorderSavedOrders } = useSavedOrders()
  const [screen, setScreen] = useState<Screen>({ name: 'run' })
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [formValid, setFormValid] = useState(false)

  const handleEndRun = useCallback(() => {
    archiveRun(activeRun!.id)
    setScreen({ name: 'run' })
  }, [activeRun, archiveRun])

  const handleAddOrder = useCallback(() => {
    setScreen({ name: 'add' })
  }, [])

  const handleNewOrder = useCallback(() => {
    setScreen({ name: 'form' })
  }, [])

  const handleEditOrder = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.id === orderId)
      setScreen({ name: 'form', orderId, prefill: order })
    },
    [orders],
  )

  const handleUsual = useCallback(
    (saved: SavedOrder) => {
      addOrder(saved.orderData)
      setScreen({ name: 'run' })
    },
    [addOrder],
  )

  const handleCustom = useCallback((saved: SavedOrder) => {
    setScreen({ name: 'form', prefill: saved.orderData })
  }, [])

  const handleFormSubmit = useCallback(
    (data: OrderFormData, save: boolean) => {
      if (screen.name === 'form' && screen.orderId) {
        updateOrder(screen.orderId, data)
      } else {
        addOrder(data)
      }
      if (save) {
        saveOrder(data)
      }
      setScreen({ name: 'run' })
    },
    [screen, addOrder, updateOrder, saveOrder],
  )

  const handleFormCancel = useCallback(() => {
    setScreen({ name: 'add' })
  }, [])

  const submitLabel =
    screen.name === 'form' && screen.orderId
      ? t('orderFormPage.updateSubmit')
      : t('orderFormPage.addSubmit')

  const endRunConfirmDialog = showEndConfirm ? (
    <ConfirmDialog
      title={t('runView.endRoundDialog.title')}
      message={t('runView.endRoundDialog.message')}
      confirmLabel={t('runView.endRoundDialog.confirm')}
      onConfirm={() => {
        setShowEndConfirm(false)
        handleEndRun()
      }}
      onCancel={() => setShowEndConfirm(false)}
    />
  ) : null

  const runView = (
    <RunView
      hasActiveRun={!!activeRun}
      orders={orders}
      onStartRun={startRun}
      onEditOrder={handleEditOrder}
      onDeleteOrder={removeOrder}
      onReorderOrder={reorderOrders}
      showHeader={breakpoint !== 'desktop'}
    />
  )

  // Desktop layout
  if (breakpoint === 'desktop') {
    const header = (
      <RunHeader
        orderCount={orders.length}
        hasActiveRun={!!activeRun}
      />
    )

    const rightPanel =
      screen.name === 'form' ? (
        <OrderFormPage
          initialData={screen.prefill}
          orderId={screen.orderId}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          showActions={false}
          onValidityChange={setFormValid}
        />
      ) : activeRun ? (
        <AddOrder
          savedOrders={savedOrders}
          onNewOrder={handleNewOrder}
          onUsual={handleUsual}
          onCustom={handleCustom}
          onDeleteSaved={removeSavedOrder}
          onReorderSaved={reorderSavedOrders}
        />
      ) : null

    const bottomBar = activeRun ? (
      <BottomAppBar
        sidebarOffset
        left={
          screen.name === 'form' ? (
            <Button variant="ghost" type="button" onClick={handleFormCancel}>
              {t('orderForm.cancel')}
            </Button>
          ) : (
            <Button variant="text" onClick={() => setShowEndConfirm(true)}>
              {t('runHeader.endRun')}
            </Button>
          )
        }
        right={
          screen.name === 'form' ? (
            <Button type="submit" form="order-form" disabled={!formValid}>
              {submitLabel}
            </Button>
          ) : undefined
        }
      />
    ) : null

    return (
      <>
        <DualPanelLayout header={header} sidebar={runView}>
          {rightPanel}
        </DualPanelLayout>
        {bottomBar}
        {endRunConfirmDialog}
      </>
    )
  }

  // Mobile layout
  if (screen.name === 'form') {
    return (
      <>
        <SinglePanelLayout header={null}>
          <div className={styles.mobilePanel}>
            <OrderFormPage
              initialData={screen.prefill}
              orderId={screen.orderId}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              showActions={false}
              onValidityChange={setFormValid}
            />
          </div>
        </SinglePanelLayout>
        <BottomAppBar
          left={
            <Button variant="ghost" type="button" onClick={handleFormCancel}>
              {t('orderForm.cancel')}
            </Button>
          }
          right={
            <Button type="submit" form="order-form" disabled={!formValid}>
              {submitLabel}
            </Button>
          }
        />
      </>
    )
  }

  if (screen.name === 'add') {
    return (
      <>
        <SinglePanelLayout header={null}>
          <div className={styles.mobilePanel}>
            <AddOrder
              savedOrders={savedOrders}
              onNewOrder={handleNewOrder}
              onUsual={handleUsual}
              onCustom={handleCustom}
              onDeleteSaved={removeSavedOrder}
              onReorderSaved={reorderSavedOrders}
            />
          </div>
        </SinglePanelLayout>
        <BottomAppBar
          left={
            <Button variant="ghost" type="button" onClick={() => setScreen({ name: 'run' })}>
              {t('addOrder.back')}
            </Button>
          }
        />
      </>
    )
  }

  return (
    <>
      <SinglePanelLayout header={null}>
        {runView}
      </SinglePanelLayout>
      {activeRun && (
        <>
          <BottomAppBar
            left={
              <Button variant="text" onClick={() => setShowEndConfirm(true)}>
                {t('runHeader.endRun')}
              </Button>
            }
            right={<Fab onClick={handleAddOrder} label={t('runView.addOrderAriaLabel')} />}
          />
          {endRunConfirmDialog}
        </>
      )}
    </>
  )
}
