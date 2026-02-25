import { APP_NAME } from '@/config'
import { Button } from '@/components/atoms'
import styles from './RunHeader.module.css'

interface RunHeaderProps {
  orderCount: number
  hasActiveRun: boolean
  onEndRun: () => void
}

export function RunHeader({ orderCount, hasActiveRun, onEndRun }: RunHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.title}>{APP_NAME}</div>
        <div className={styles.subtitle}>
          {hasActiveRun ? (
            <>
              Brew round in progress{' '}
              <span className={styles.orderCount}>
                · {orderCount} {orderCount === 1 ? 'order' : 'orders'}
              </span>
            </>
          ) : (
            "No run on \u2014 fancy starting one?"
          )}
        </div>
      </div>
      {hasActiveRun && (
        <Button variant="secondary" onClick={onEndRun}>
          End Run
        </Button>
      )}
    </header>
  )
}
