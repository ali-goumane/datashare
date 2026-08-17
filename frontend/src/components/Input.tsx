import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './Input.module.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: ReactNode
  error?: string
}

export function Input({
  label,
  id,
  hint,
  error,
  className,
  ...rest
}: InputProps) {
  const inputId = id ?? rest.name ?? label.replace(/\s+/g, '-').toLowerCase()
  return (
    <label className={styles.field} htmlFor={inputId}>
      <span className={styles.label}>{label}</span>
      <input
        id={inputId}
        className={[styles.input, error ? styles.invalid : '', className]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...rest}
      />
      {hint && !error ? (
        <span id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
