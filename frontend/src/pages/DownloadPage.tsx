import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Callout } from '../components/Callout'
import { Card } from '../components/Card'
import { DownloadIcon, ImageFileIcon } from '../components/Icons'
import { Input } from '../components/Input'
import { api } from '../services/api'
import type { FileMetadata } from '../types'
import { daysUntil, formatFileSize } from '../utils/format'
import styles from './pages.module.css'

export function DownloadPage() {
  const { token = '' } = useParams()
  const [meta, setMeta] = useState<FileMetadata | null>(null)
  const [password, setPassword] = useState('')
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [loadingDownload, setLoadingDownload] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoadingMeta(true)
      setError(null)
      setUnavailable(false)
      try {
        const data = await api.getFileMetadata(token)
        if (cancelled) return
        setMeta(data)
        if (data.expired) setUnavailable(true)
      } catch {
        if (!cancelled) {
          setMeta(null)
          setUnavailable(true)
        }
      } finally {
        if (!cancelled) setLoadingMeta(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token])

  const onDownload = async (event: FormEvent) => {
    event.preventDefault()
    if (!meta || meta.expired) return
    setError(null)
    setLoadingDownload(true)
    try {
      const blob = await api.downloadFile(token, meta.hasPassword ? password : undefined)
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = meta.name
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch {
      setError('Ce mot de passe est incorrect.')
    } finally {
      setLoadingDownload(false)
    }
  }

  const remaining = meta ? daysUntil(meta.expire_at) : 0
  const expiryLabel =
    remaining <= 1
      ? 'Ce fichier expirera demain.'
      : `Ce fichier expirera dans ${remaining} jours.`
  const downloadDisabled = Boolean(meta?.hasPassword && !password.trim())

  return (
    <div className={styles.center}>
      <Card as="section" className={styles.authCard} aria-labelledby="download-title">
        <h1 id="download-title" className={styles.authTitle}>
          Télécharger un fichier
        </h1>

        {loadingMeta ? <p className={styles.muted}>Chargement…</p> : null}

        {!loadingMeta && unavailable ? (
          <Callout variant="error">
            Ce fichier n&apos;est plus disponible en téléchargement car il a expiré.
          </Callout>
        ) : null}

        {!loadingMeta && meta && !unavailable ? (
          <>
            <div className={styles.fileHead}>
              <span className={styles.fileIcon}>
                <ImageFileIcon />
              </span>
              <div>
                <p className={styles.fileName}>{meta.name}</p>
                <p className={styles.muted}>{formatFileSize(meta.size)}</p>
              </div>
            </div>

            <Callout variant={remaining <= 1 ? 'warning' : 'info'}>{expiryLabel}</Callout>

            <form className={styles.form} onSubmit={onDownload}>
              {meta.hasPassword ? (
                <Input
                  label="Mot de passe"
                  name="password"
                  type="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Saisissez le mot de passe..."
                  disabled={loadingDownload}
                />
              ) : null}

              {error ? <Callout variant="error">{error}</Callout> : null}

              <Button
                type="submit"
                variant="outline"
                loading={loadingDownload}
                disabled={downloadDisabled}
                icon={<DownloadIcon />}
              >
                Télécharger
              </Button>
            </form>
          </>
        ) : null}
      </Card>
    </div>
  )
}
