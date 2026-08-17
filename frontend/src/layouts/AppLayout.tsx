import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import styles from './AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#contenu">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
