import { useTranslation } from 'react-i18next'
import styles from './RunHeader.module.css'

interface RunHeaderProps {
  orderCount: number
  hasActiveRun: boolean
}

export function RunHeader({ orderCount, hasActiveRun }: RunHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.title}>{t('app.name')}</div>
        <div className={styles.subtitle}>
          {hasActiveRun ? (
            <>
              {t('runHeader.roundInProgress')}{' '}
              <span className={styles.orderCount}>
                {t('runHeader.orderCount', { count: orderCount })}
              </span>
            </>
          ) : (
            t('runHeader.noRun')
          )}
        </div>
      </div>
    </header>
  )
}
