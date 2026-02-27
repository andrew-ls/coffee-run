import { useTranslation } from 'react-i18next'
import styles from './LandingPage.module.css'

function DesktopArrow() {
  return (
    <svg
      className={styles.desktopArrow}
      width="64"
      height="28"
      viewBox="0 0 64 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M60 14C40 14 28 14 12 14"
        stroke="var(--color-secondary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 4"
      />
      <path
        d="M16 6L6 14L16 22"
        stroke="var(--color-secondary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function StartRunIllustration() {
  return (
    <svg width="140" height="36" viewBox="0 0 140 36" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="138" height="34" rx="12" fill="var(--color-primary)" />
      <text
        x="70"
        y="22"
        textAnchor="middle"
        fill="#fff"
        fontSize="12"
        fontWeight="700"
        fontFamily="Nunito, sans-serif"
      >
        Start a new Run
      </text>
    </svg>
  )
}

function FabIllustration() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="40" height="40" rx="12" fill="var(--color-primary)" />
      <line
        x1="22"
        y1="13"
        x2="22"
        y2="31"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="22"
        x2="31"
        y2="22"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function EndRunIllustration() {
  return (
    <svg width="72" height="36" viewBox="0 0 72 36" fill="none" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="70"
        height="34"
        rx="12"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text
        x="36"
        y="22"
        textAnchor="middle"
        fill="var(--color-text-muted)"
        fontSize="12"
        fontWeight="700"
        fontFamily="Nunito, sans-serif"
      >
        End Run
      </text>
    </svg>
  )
}

const STEPS = [
  { key: 'startRun', showArrow: true, illustration: StartRunIllustration },
  { key: 'addOrders', illustration: FabIllustration },
  { key: 'endRun', illustration: EndRunIllustration },
]

export function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('landingPage.title')}</h1>

      <ol className={styles.steps}>
        {STEPS.map(({ key, showArrow, illustration: Illustration }, i) => (
          <li key={key} className={styles.step}>
            {showArrow && <DesktopArrow />}
            <span className={styles.stepNumber}>{i + 1}</span>
            <div className={styles.stepBody}>
              <h2 className={styles.stepTitle}>{t(`landingPage.steps.${key}.title`)}</h2>
              <p className={styles.stepDescription}>{t(`landingPage.steps.${key}.description`)}</p>
              <div className={styles.illustration}>
                <Illustration />
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.features}>
        <h2 className={styles.featuresTitle}>{t('landingPage.features.title')}</h2>
        <ul className={styles.featureList}>
          <li className={styles.feature}>{t('landingPage.features.savedOrders')}</li>
          <li className={styles.feature}>{t('landingPage.features.swipeToDelete')}</li>
          <li className={styles.feature}>{t('landingPage.features.dragToReorder')}</li>
        </ul>
      </div>
    </div>
  )
}
