import { useState, useCallback } from 'react'
import type { OrderFormData, SavedOrder } from '@/types'
import { useRun, useOrders, useSavedOrders, useBreakpoint } from '@/hooks'
import { SinglePanelLayout } from '@/components/templates/SinglePanelLayout'
import { DualPanelLayout } from '@/components/templates/DualPanelLayout'
import { RunHeader } from '@/components/organisms'
import { RunView } from '@/pages/RunView'
import { AddOrder } from '@/pages/AddOrder'
import { OrderFormPage } from '@/pages/OrderFormPage'
import styles from './App.module.css'

type Screen =
  | { name: 'run' }
  | { name: 'add' }
  | { name: 'form'; orderId?: string; prefill?: Partial<OrderFormData> }

export default function App() {
  const breakpoint = useBreakpoint()
  const { activeRun, startRun, archiveRun } = useRun()
  const { orders, addOrder, updateOrder, removeOrder } = useOrders(activeRun?.id ?? null)
  const { savedOrders, saveOrder, removeSavedOrder } = useSavedOrders()
  const [screen, setScreen] = useState<Screen>({ name: 'run' })

  const handleStartRun = useCallback(() => {
    startRun()
  }, [startRun])

  const handleEndRun = useCallback(() => {
    if (activeRun) {
      archiveRun(activeRun.id)
    }
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
      if (order) {
        setScreen({ name: 'form', orderId, prefill: order })
      }
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
    if (breakpoint === 'mobile') {
      setScreen({ name: 'add' })
    } else {
      setScreen({ name: 'add' })
    }
  }, [breakpoint])

  const runView = (
    <RunView
      hasActiveRun={!!activeRun}
      orders={orders}
      onStartRun={handleStartRun}
      onEndRun={handleEndRun}
      onAddOrder={handleAddOrder}
      onEditOrder={handleEditOrder}
      onDeleteOrder={removeOrder}
      showHeader={breakpoint !== 'desktop'}
      showAddButton={breakpoint !== 'desktop'}
    />
  )

  // Desktop layout
  if (breakpoint === 'desktop') {
    const header = (
      <RunHeader
        orderCount={orders.length}
        hasActiveRun={!!activeRun}
        onEndRun={handleEndRun}
      />
    )

    const rightPanel =
      screen.name === 'form' ? (
        <OrderFormPage
          initialData={screen.prefill}
          orderId={screen.orderId}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : activeRun ? (
        <AddOrder
          savedOrders={savedOrders}
          onNewOrder={handleNewOrder}
          onUsual={handleUsual}
          onCustom={handleCustom}
          onDeleteSaved={removeSavedOrder}
          onBack={() => setScreen({ name: 'run' })}
          showBack={false}
        />
      ) : null

    return (
      <DualPanelLayout header={header} sidebar={runView}>
        {rightPanel}
      </DualPanelLayout>
    )
  }

  // Mobile layout
  if (screen.name === 'form') {
    return (
      <SinglePanelLayout header={null}>
        <div className={styles.mobilePanel}>
          <OrderFormPage
            initialData={screen.prefill}
            orderId={screen.orderId}
            onSubmit={handleFormSubmit}
            onCancel={() => setScreen({ name: 'add' })}
          />
        </div>
      </SinglePanelLayout>
    )
  }

  if (screen.name === 'add') {
    return (
      <SinglePanelLayout header={null}>
        <div className={styles.mobilePanel}>
          <AddOrder
            savedOrders={savedOrders}
            onNewOrder={handleNewOrder}
            onUsual={handleUsual}
            onCustom={handleCustom}
            onDeleteSaved={removeSavedOrder}
            onBack={() => setScreen({ name: 'run' })}
          />
        </div>
      </SinglePanelLayout>
    )
  }

  return (
    <SinglePanelLayout header={null}>
      {runView}
    </SinglePanelLayout>
  )
}
