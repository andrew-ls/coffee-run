import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/atoms'
import styles from './RunHeader.module.css'

interface RunHeaderProps {
  orderCount: number
  hasActiveRun: boolean
  onHelpClick?: () => void
}

export function RunHeader({ orderCount, hasActiveRun, onHelpClick }: RunHeaderProps) {
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
      {onHelpClick && (
        <IconButton
          variant="primary"
          className={styles.helpButton}
          onClick={onHelpClick}
          label={t('runHeader.helpAriaLabel')}
        >
          ?
        </IconButton>
      )}
    </header>
  )
}
