import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          {orderId ? t('orderFormPage.editTitle') : t('orderFormPage.newTitle')}
        </div>
      </div>
      <OrderForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitLabel={orderId ? t('orderFormPage.updateSubmit') : t('orderFormPage.addSubmit')}
      />
    </div>
  )
}
