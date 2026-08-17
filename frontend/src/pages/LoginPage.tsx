import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Callout } from '../components/Callout'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/format'
import styles from './pages.module.css'

export function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/espace'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!authLoading && isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Connexion impossible'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.center}>
      <Card as="section" className={styles.authCard} aria-labelledby="login-title">
        <h1 id="login-title" className={styles.authTitle}>
          Connexion
        </h1>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <Input
            label="Email"
            name="email"
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Saisissez votre email..."
            disabled={loading}
          />
          <Input
            label="Mot de passe"
            name="password"
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Saisissez votre mot de passe..."
            disabled={loading}
          />

          <p className={styles.centerNote}>
            <Link to="/register" className={styles.inlineLink}>
              Créer un compte
            </Link>
          </p>

          {error ? <Callout variant="error">{error}</Callout> : null}

          <Button type="submit" variant="outline" loading={loading} data-testid="login-submit">
            Connexion
          </Button>
        </form>
      </Card>
    </div>
  )
}
