import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './BottomNav.module.css'

export function BottomNav() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return null

  return (
    <nav className={styles.bar} aria-label="Navigation secondaire">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')
        }
      >
        <span className={styles.icon} aria-hidden="true">
          📤
        </span>
        <span>Transfert</span>
      </NavLink>
      <NavLink
        to="/espace"
        className={({ isActive }) =>
          [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')
        }
      >
        <span className={styles.icon} aria-hidden="true">
          📁
        </span>
        <span>Mon Espace</span>
      </NavLink>
    </nav>
  )
}
