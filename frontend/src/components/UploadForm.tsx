import { useEffect, useRef, useState } from 'react'
import { api } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import type { UploadedFile } from '../types'
import { daysUntil, formatFileSize, getErrorMessage } from '../utils/format'
import { Button } from './Button'
import { Card } from './Card'
import { CopyIcon, ImageFileIcon, UploadCloudIcon } from './Icons'
import { Input } from './Input'
import { Select } from './Select'
import styles from './UploadForm.module.css'

const MAX_FILE_SIZE = 1024 * 1024 * 1024

const EXPIRE_OPTIONS = [
  { value: '1', label: 'Une journée' },
  { value: '2', label: '2 jours' },
  { value: '3', label: '3 jours' },
  { value: '4', label: '4 jours' },
  { value: '5', label: '5 jours' },
  { value: '6', label: '6 jours' },
  { value: '7', label: '7 jours' },
]

type ShareResult = {
  token: string
  name: string
  size: number
  expireAt?: string
}

type UploadFormProps = {
  variant?: 'public' | 'espace'
  onBack?: () => void
  initialFile?: File | null
  onFileChange?: (file: File) => void
  initialResult?: ShareResult | null
}

function retentionPhrase(days: number): string {
  if (days <= 1) return 'une journée'
  if (days >= 7) return 'une semaine'
  return `${days} jours`
}

export function UploadForm({
  variant = 'espace',
  onBack,
  initialFile = null,
  onFileChange,
  initialResult = null,
}: UploadFormProps) {
  const { isAuthenticated } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(initialFile)
  const [password, setPassword] = useState('')
  const [expireDays, setExpireDays] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)
  const [result, setResult] = useState<UploadedFile | ShareResult | null>(initialResult)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!initialFile) return
    setFile(initialFile)
    if (initialFile.size > MAX_FILE_SIZE) {
      setSizeError('La taille des fichiers est limitée à 1 Go')
    } else {
      setSizeError(null)
    }
  }, [initialFile])

  const shareUrl = result ? `${window.location.origin}/download/${result.token}` : ''
  const keptDays =
    result && 'expireAt' in result && result.expireAt
      ? Math.max(1, daysUntil(result.expireAt))
      : expireDays
  const isPublic = variant === 'public'

  const pickFile = (next: File | null) => {
    if (!next) return
    setResult(null)
    setError(null)
    setFile(next)
    onFileChange?.(next)
    if (next.size > MAX_FILE_SIZE) {
      setSizeError('La taille des fichiers est limitée à 1 Go')
      return
    }
    setSizeError(null)
  }

  const upload = async () => {
    if (!file || sizeError) return
    if (password && password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (password) formData.append('password', password)
      formData.append('expireDays', String(expireDays))
      const uploaded = await api.uploadFile(formData, isAuthenticated)
      setResult(uploaded)
      setPassword('')
    } catch (err) {
      setError(getErrorMessage(err, "Échec de l'envoi du fichier"))
    } finally {
      setLoading(false)
    }
  }

  const copyLink = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Impossible de copier le lien.')
    }
  }

  const formBody = result ? (
    <>
      <h1 className={styles.title}>Ajouter un fichier</h1>
      <div className={styles.fileRow}>
        <span className={styles.fileIcon}>
          <ImageFileIcon />
        </span>
        <div className={styles.fileMeta}>
          <p className={styles.fileName}>{result.name}</p>
          <p className={styles.fileSize}>{formatFileSize(result.size)}</p>
        </div>
      </div>
      <p className={styles.successText}>
        Félicitations, ton fichier sera conservé chez nous pendant {retentionPhrase(keptDays)} !
      </p>
      <div className={styles.linkBox}>
        <a href={shareUrl} className={styles.link}>
          {shareUrl}
        </a>
      </div>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="outline"
          className={styles.actionBtn}
          icon={<CopyIcon />}
          onClick={() => void copyLink()}
        >
          {copied ? 'Lien copié' : 'Copier le lien'}
        </Button>
      </div>
    </>
  ) : (
    <>
      <h1 className={styles.title}>Ajouter un fichier</h1>
      <div className={styles.fileRow}>
        <span className={styles.fileIcon}>
          <ImageFileIcon />
        </span>
        <div className={styles.fileMeta}>
          {file ? (
            <>
              <p className={sizeError ? styles.fileNameError : styles.fileName}>{file.name}</p>
              <p className={sizeError ? styles.fileSizeError : styles.fileSize}>
                {formatFileSize(file.size)}
              </p>
            </>
          ) : (
            <p className={styles.fileSize}>Aucun fichier sélectionné</p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          className={styles.hidden}
          onChange={(e) => {
            pickFile(e.target.files?.[0] ?? null)
            e.target.value = ''
          }}
        />
        <Button type="button" variant="outline" compact onClick={() => inputRef.current?.click()}>
          {file ? 'Changer' : 'Choisir'}
        </Button>
      </div>
      {sizeError ? <p className={styles.sizeError}>{sizeError}</p> : null}

      <div className={styles.fields}>
        <Input
          label="Mot de passe"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Optionnel"
          disabled={loading}
        />

        <Select
          label="Expiration"
          name="expireDays"
          value={String(expireDays)}
          onChange={(e) => setExpireDays(Number(e.target.value))}
          options={EXPIRE_OPTIONS}
          disabled={loading}
        />

        {error ? <p className={styles.sizeError}>{error}</p> : null}

        <div className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            className={styles.actionBtn}
            loading={loading}
            disabled={!file || Boolean(sizeError)}
            data-testid="upload-submit"
            icon={<UploadCloudIcon size={16} />}
            onClick={() => void upload()}
          >
            Téléverser
          </Button>
        </div>
      </div>
    </>
  )

  if (isPublic) {
    return (
      <div className={styles.publicShell}>
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Fermer"
          onClick={onBack}
        />
        <div className={styles.publicSheet}>
          <Card className={styles.publicCard}>{formBody}</Card>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      {onBack ? (
        <button type="button" className={styles.back} onClick={onBack}>
          ← Retour
        </button>
      ) : null}
      <Card>{formBody}</Card>
    </div>
  )
}
