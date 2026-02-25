import type { OrderFormData } from '@/types'
import { OrderForm } from '@/components/organisms'
import styles from './OrderFormPage.module.css'

interface OrderFormPageProps {
  initialData?: Partial<OrderFormData>
  orderId?: string
  onSubmit: (data: OrderFormData, save: boolean) => void
  onCancel: () => void
}

export function OrderFormPage({
  initialData,
  orderId,
  onSubmit,
  onCancel,
}: OrderFormPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          {orderId ? 'Edit Order' : 'New Order'}
        </div>
      </div>
      <OrderForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitLabel={orderId ? 'Update order' : 'Add order'}
      />
    </div>
  )
}
