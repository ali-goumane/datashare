import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Logo } from "./Logo";
import { Button } from "./Button";
import styles from "./Header.module.css";

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />
        <nav className={styles.nav} aria-label="Navigation principale">
          {isAuthenticated ? (
            <Link to="/espace" className={styles.loginLink}>
              <Button variant="dark">Mon espace</Button>
            </Link>
          ) : (
            <Link to="/login" className={styles.loginLink}>
              <Button variant="dark">Se connecter</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
