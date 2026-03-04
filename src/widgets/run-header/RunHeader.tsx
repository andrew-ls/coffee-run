import { useTranslation } from 'react-i18next'
import { IconButton } from '@/shared/ui/IconButton'
import { useRunContext } from '@/app/contexts/RunContext'
import { useActiveOrderContext } from '@/app/contexts/ActiveOrderContext'
import styles from './RunHeader.module.css'

interface RunHeaderProps {
  onHelpClick?: () => void
}

export function RunHeader({ onHelpClick }: RunHeaderProps) {
  const { t } = useTranslation()
  const { activeRun } = useRunContext()
  const { orders } = useActiveOrderContext()
  const hasActiveRun = !!activeRun
  const orderCount = orders.length

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
