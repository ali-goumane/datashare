import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Callout } from '../components/Callout'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/format'
import styles from './pages.module.css'

export function RegisterPage() {
  const { register, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/espace" replace />
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      await register(email.trim(), password)
      navigate('/espace', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de créer le compte'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.center}>
      <Card as="section" className={styles.authCard} aria-labelledby="register-title">
        <h1 id="register-title" className={styles.authTitle}>
          Créer un compte
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Saisissez votre mot de passe..."
            disabled={loading}
          />
          <Input
            label="Vérification du mot de passe"
            name="confirm"
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Saisissez-le à nouveau..."
            disabled={loading}
          />

          <p className={styles.centerNote}>
            <Link to="/login" className={styles.inlineLink}>
              J&apos;ai déjà un compte
            </Link>
          </p>

          {error ? <Callout variant="error">{error}</Callout> : null}

          <Button type="submit" variant="outline" loading={loading} data-testid="register-submit">
            Créer mon compte
          </Button>
        </form>
      </Card>
    </div>
  )
}
