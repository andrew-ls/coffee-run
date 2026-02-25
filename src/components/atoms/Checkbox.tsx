import type { InputHTMLAttributes } from 'react'
import styles from './Checkbox.module.css'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={`${styles.label} ${className ?? ''}`}>
      <input type="checkbox" className={styles.checkbox} {...props} />
      {label}
    </label>
  )
}
