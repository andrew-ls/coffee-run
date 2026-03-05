import styles from './Fab.module.css'

interface FabProps {
  onClick: () => void
  label: string
}

export function Fab({ onClick, label }: FabProps) {
  return (
    <button className={styles.fab} onClick={onClick} aria-label={label}>
      +
    </button>
  )
}
