import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { OrderFormData } from '@/shared/types'
import type { SavedOrder } from '@/entities/saved-order'
import { useBreakpoint } from '@/shared/hooks'
import { DualPanelLayout, BottomAppBar, PageTransition } from '@/widgets/layout'
import { Fab } from '@/shared/ui/Fab'
import { RunHeader } from '@/widgets/run-header'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { RunView, AddOrder, OrderFormPage, LandingPage } from '@/pages'
import { RunProvider, useRunContext } from './contexts/RunContext'
import { ActiveOrderProvider, useActiveOrderContext } from './contexts/ActiveOrderContext'
import { SavedOrderProvider, useSavedOrderContext } from './contexts/SavedOrderContext'

type Screen =
  | { name: 'landing' }
  | { name: 'add' }
  | { name: 'form'; orderId?: string; prefill?: Partial<OrderFormData> }

function AppContent() {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()
  const { activeRun, startRun, archiveRun } = useRunContext()
  const { orders, addOrder, updateOrder } = useActiveOrderContext()
  const { saveOrder } = useSavedOrderContext()
  const [screen, setScreen] = useState<Screen>({ name: 'landing' })
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [formValid, setFormValid] = useState(false)
  const [sidebarActive, setSidebarActive] = useState(true)

  const handleStartRun = useCallback(() => {
    startRun()
    setDirection('forward')
    setScreen({ name: 'add' })
  }, [startRun])

  const handleEndRun = useCallback(() => {
    archiveRun(activeRun!.id)
    setDirection('back')
    setScreen({ name: 'landing' })
    setSidebarActive(true)
  }, [activeRun, archiveRun])

  const handleAddOrder = useCallback(() => {
    setDirection('forward')
    setScreen({ name: 'add' })
    setSidebarActive(false)
  }, [])

  const handleNewOrder = useCallback(() => {
    setDirection('forward')
    setScreen({ name: 'form' })
  }, [])

  const handleEditOrder = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.id === orderId)
      setDirection('forward')
      setScreen({ name: 'form', orderId, prefill: order })
      if (breakpoint !== 'desktop') setSidebarActive(false)
    },
    [orders, breakpoint],
  )

  const handleUsual = useCallback(
    (saved: SavedOrder) => {
      addOrder(saved.orderData)
      setDirection('back')
      setScreen({ name: 'add' })
      setSidebarActive(true)
    },
    [addOrder],
  )

  const handleCustom = useCallback((saved: SavedOrder) => {
    setDirection('forward')
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
      setDirection('back')
      setScreen({ name: 'add' })
      setSidebarActive(true)
    },
    [screen, addOrder, updateOrder, saveOrder],
  )

  const handleFormCancel = useCallback(() => {
    setDirection('back')
    setScreen({ name: 'add' })
  }, [])

  const handleBack = useCallback(() => {
    if (breakpoint === 'desktop') {
      setDirection('back')
      setScreen({ name: 'landing' })
    } else {
      setSidebarActive(true)
    }
  }, [breakpoint])

  const handleHelpClick = useCallback(() => {
    setDirection('back')
    setScreen({ name: 'landing' })
    setSidebarActive(false)
  }, [])

  const submitLabel =
    screen.name === 'form' && screen.orderId
      ? t('orderFormPage.updateSubmit')
      : t('orderFormPage.addSubmit')

  const sidebarBar = activeRun ? (
    <BottomAppBar
      left={
        <Button variant="text" onClick={() => setShowEndConfirm(true)}>
          {t('runHeader.endRun')}
        </Button>
      }
      right={
        breakpoint !== 'desktop' || screen.name === 'landing' ? (
          <Fab onClick={handleAddOrder} label={t('runView.addOrderAriaLabel')} />
        ) : undefined
      }
    />
  ) : null

  const mainBar = (() => {
    if (screen.name === 'form') {
      return (
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
      )
    }
    if (screen.name === 'add' || (screen.name === 'landing' && breakpoint !== 'desktop')) {
      return (
        <BottomAppBar
          left={
            <Button variant="ghost" type="button" onClick={handleBack}>
              {t('addOrder.back')}
            </Button>
          }
        />
      )
    }
    return null
  })()

  const mainContent = (() => {
    switch (screen.name) {
      case 'form':
        return (
          <OrderFormPage
            initialData={screen.prefill}
            orderId={screen.orderId}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            showActions={false}
            onValidityChange={setFormValid}
          />
        )
      case 'add':
        return (
          <AddOrder
            onNewOrder={handleNewOrder}
            onUsual={handleUsual}
            onCustom={handleCustom}
          />
        )
      default:
        return <LandingPage />
    }
  })()

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

  return (
    <>
      <DualPanelLayout
        sidebarActive={sidebarActive}
        header={<RunHeader onHelpClick={handleHelpClick} />}
        sidebar={
          <RunView onStartRun={handleStartRun} onEditOrder={handleEditOrder} />
        }
        sidebarBottom={sidebarBar}
        mainBottom={mainBar}
      >
        <PageTransition contentKey={screen.name} direction={direction}>
          {mainContent}
        </PageTransition>
      </DualPanelLayout>
      {endRunConfirmDialog}
    </>
  )
}

export default function App() {
  return (
    <RunProvider>
      <ActiveOrderProvider>
        <SavedOrderProvider>
          <AppContent />
        </SavedOrderProvider>
      </ActiveOrderProvider>
    </RunProvider>
  )
}
