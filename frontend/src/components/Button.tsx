import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'outline' | 'dark' | 'soft' | 'secondary' | 'danger' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  loading?: boolean
  compact?: boolean
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  loading = false,
  compact = false,
  disabled,
  children,
  className,
  type = 'button',
  icon,
  iconPosition = 'start',
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    compact ? styles.compact : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        'Chargement…'
      ) : (
        <>
          {icon && iconPosition === 'start' ? <span className={styles.icon}>{icon}</span> : null}
          <span>{children}</span>
          {icon && iconPosition === 'end' ? <span className={styles.icon}>{icon}</span> : null}
        </>
      )}
    </button>
  )
}
