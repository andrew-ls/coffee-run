import { useTranslation } from 'react-i18next'
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
      <svg
        width="14"
        height="20"
        viewBox="0 0 14 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="4" cy="4" r="2" />
        <circle cx="10" cy="4" r="2" />
        <circle cx="4" cy="10" r="2" />
        <circle cx="10" cy="10" r="2" />
        <circle cx="4" cy="16" r="2" />
        <circle cx="10" cy="16" r="2" />
      </svg>
    </span>
  )
}
