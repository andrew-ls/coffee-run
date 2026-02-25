import { useTranslation } from 'react-i18next'
import { Button } from '@/components/atoms'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  confirmVariant?: 'primary' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{title}</div>
        <div className={styles.message}>{message}</div>
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel}>
            {t('confirmDialog.cancel')}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel ?? t('confirmDialog.confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
