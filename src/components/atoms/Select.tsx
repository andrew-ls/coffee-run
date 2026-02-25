import type { SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

type SelectOption = string | { value: string; label: string }

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly SelectOption[]
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
      {options.map((opt) => {
        const value = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        return (
          <option key={value} value={value}>
            {label}
          </option>
        )
      })}
    </select>
  )
}
