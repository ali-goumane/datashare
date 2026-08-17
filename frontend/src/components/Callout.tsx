import type { ReactNode } from 'react'
import styles from './Callout.module.css'

type CalloutVariant = 'info' | 'warning' | 'error' | 'success'

type CalloutProps = {
  variant?: CalloutVariant
  children: ReactNode
  role?: 'alert' | 'status'
}

const ICONS: Record<CalloutVariant, string> = {
  info: 'ℹ',
  warning: '⚠',
  error: '!',
  success: '✓',
}

export function Callout({
  variant = 'info',
  children,
  role = variant === 'error' ? 'alert' : 'status',
}: CalloutProps) {
  return (
    <div className={[styles.callout, styles[variant]].join(' ')} role={role}>
      <span className={styles.icon} aria-hidden="true">
        {ICONS[variant]}
      </span>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
