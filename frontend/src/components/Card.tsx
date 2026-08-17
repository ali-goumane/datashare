import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.css'

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  as?: 'div' | 'section' | 'article'
}

export function Card({
  children,
  className,
  as: Tag = 'div',
  ...rest
}: CardProps) {
  return (
    <Tag className={[styles.card, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  )
}
