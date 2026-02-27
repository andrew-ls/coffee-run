import { useTranslation } from 'react-i18next'
import { DragHandleIcon } from '@/assets/icons'
import styles from './DragHandle.module.css'

export function DragHandle(props: React.HTMLAttributes<HTMLSpanElement>) {
  const { t } = useTranslation()

  return (
    <span
      className={styles.handle}
      aria-label={t('dragHandle.ariaLabel')}
      role="button"
      tabIndex={0}
      {...props}
    >
      <DragHandleIcon aria-hidden="true" />
    </span>
  )
}
