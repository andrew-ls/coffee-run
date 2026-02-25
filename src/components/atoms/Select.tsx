import type { SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly string[]
  placeholder?: string
}

export function Select({
  options,
  placeholder,
  className,
  ...props
}: SelectProps) {
  return (
    <select className={`${styles.select} ${className ?? ''}`} {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
