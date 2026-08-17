import type { ReactNode, SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  hint?: ReactNode
  error?: string
  options: Array<{ value: string; label: string }>
}

export function Select({
  label,
  id,
  hint,
  error,
  options,
  className,
  ...rest
}: SelectProps) {
  const selectId = id ?? rest.name ?? label.replace(/\s+/g, '-').toLowerCase()
  return (
    <label className={styles.field} htmlFor={selectId}>
      <span className={styles.label}>{label}</span>
      <span className={styles.wrap}>
        <select
          id={selectId}
          className={[styles.select, error ? styles.invalid : '', className]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
          }
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </span>
      {hint && !error ? (
        <span id={`${selectId}-hint`} className={styles.hint}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${selectId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
