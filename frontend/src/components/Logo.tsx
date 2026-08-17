import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

type LogoProps = {
  to?: string
  light?: boolean
}

export function Logo({ to = '/', light = false }: LogoProps) {
  return (
    <Link
      to={to}
      className={[styles.logo, light ? styles.light : ''].filter(Boolean).join(' ')}
      aria-label="DataShare — accueil"
    >
      DataShare
    </Link>
  )
}
