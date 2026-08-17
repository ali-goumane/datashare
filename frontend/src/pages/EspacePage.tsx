import { useCallback, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Button } from '../components/Button'
import { Callout } from '../components/Callout'
import {
  CloseIcon,
  ImageFileIcon,
  LockIcon,
  LogOutIcon,
  MenuIcon,
  TrashIcon,
} from '../components/Icons'
import { Logo } from '../components/Logo'
import { UploadForm } from '../components/UploadForm'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import type { FileHistoryItem } from '../types'
import { daysUntil, getErrorMessage } from '../utils/format'
import styles from './EspacePage.module.css'

type Tab = 'all' | 'active' | 'expired'

function useIsDesktop(minWidth = 901) {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${minWidth}px)`).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${minWidth}px)`)
    const onChange = () => setIsDesktop(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [minWidth])

  return isDesktop
}

export function EspacePage() {
  const { isAuthenticated, loading: authLoading, logout, user } = useAuth()
  const location = useLocation()
  const isDesktop = useIsDesktop()
  const [files, setFiles] = useState<FileHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [tab, setTab] = useState<Tab>('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [shareFile, setShareFile] = useState<FileHistoryItem | null>(null)

  const loadFiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setFiles(await api.listFiles())
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de charger vos fichiers'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) void loadFiles()
  }, [isAuthenticated, loadFiles])

  if (authLoading) {
    return <p className={styles.muted}>Chargement…</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const filtered = files.filter((file) => {
    if (tab === 'all') return true
    return tab === 'expired' ? file.status === 'expired' : file.status === 'valid'
  })

  const onDelete = async (file: FileHistoryItem) => {
    if (!window.confirm('Êtes-vous sûr ? Cette action est irréversible.')) return
    setDeletingId(file.fileId)
    setError(null)
    try {
      await api.deleteFile(file.fileId)
      setFiles((prev) => prev.filter((item) => item.fileId !== file.fileId))
      setMessage('Fichier supprimé')
    } catch (err) {
      setError(getErrorMessage(err, 'Suppression impossible'))
    } finally {
      setDeletingId(null)
    }
  }

  const openUpload = () => {
    setShareFile(null)
    setShowUpload(true)
    setMenuOpen(false)
  }

  const showFiles = () => {
    setShowUpload(false)
    setShareFile(null)
    setMenuOpen(false)
  }

  const displayName = user?.email?.split('@')[0] ?? 'Mon compte'

  return (
    <div className={styles.shell}>
      <aside className={[styles.sidebar, menuOpen ? styles.sidebarOpen : ''].join(' ')}>
        <button
          type="button"
          className={styles.closeMenu}
          onClick={() => setMenuOpen(false)}
          aria-label="Fermer le menu"
        >
          <CloseIcon />
        </button>
        <Logo to="/espace" light />
        <button type="button" className={styles.navItem} onClick={showFiles}>
          Mes fichiers
        </button>
        {!isDesktop ? (
          <button type="button" className={styles.navItemGhost} onClick={openUpload}>
            Ajouter des fichiers
          </button>
        ) : null}
        <p className={styles.copyright}>Copyright DataShare® 2025</p>
      </aside>

      {menuOpen ? (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div className={styles.main}>
        <div className={styles.topbar}>
          <button
            type="button"
            className={styles.burger}
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <MenuIcon />
          </button>

          {isDesktop ? (
            <div className={styles.topActions}>
              <Button variant="dark" onClick={openUpload}>
                Ajouter des fichiers
              </Button>
              <button
                type="button"
                className={styles.logout}
                onClick={logout}
                aria-label="Déconnexion"
              >
                <LogOutIcon />
                <span>Déconnexion</span>
              </button>
            </div>
          ) : (
            <div className={styles.topActions}>
              <span className={styles.userName}>{displayName}</span>
              <button
                type="button"
                className={styles.logout}
                onClick={logout}
                aria-label="Déconnexion"
              >
                <LogOutIcon />
              </button>
            </div>
          )}
        </div>

        <div className={styles.content}>
          {showUpload || shareFile ? (
            <UploadForm
              onBack={() => {
                setShowUpload(false)
                setShareFile(null)
                void loadFiles()
              }}
              initialResult={
                shareFile
                  ? {
                      token: shareFile.token,
                      name: shareFile.name,
                      size: shareFile.size ?? 0,
                      expireAt: shareFile.expireAt,
                    }
                  : null
              }
            />
          ) : (
            <>
              <h1 className={styles.title}>Mes fichiers</h1>
              <div className={styles.tabs} role="tablist" aria-label="Filtrer les fichiers">
                {(
                  [
                    ['all', 'Tous'],
                    ['active', 'Actifs'],
                    ['expired', 'Expiré'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={tab === id}
                    className={[styles.tab, tab === id ? styles.tabActive : ''].join(' ')}
                    onClick={() => setTab(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {error ? <Callout variant="error">{error}</Callout> : null}
              {message ? <Callout variant="success">{message}</Callout> : null}
              {loading ? <p className={styles.muted}>Chargement de l&apos;historique…</p> : null}

              {!loading && filtered.length === 0 ? (
                <p className={styles.muted}>Aucun fichier dans cette vue.</p>
              ) : null}

              <ul className={styles.list}>
                {filtered.map((file) => {
                  const remaining = daysUntil(file.expireAt)
                  const expired = file.status === 'expired'
                  const expiryText = expired
                    ? 'Expiré'
                    : remaining <= 1
                      ? 'Expire demain'
                      : `Expire dans ${remaining} jours`
                  return (
                    <li key={file.fileId} className={styles.item}>
                      <div className={styles.info}>
                        <span className={styles.fileBadge}>
                          <ImageFileIcon />
                        </span>
                        <div>
                          <p className={styles.name}>{file.name}</p>
                          <p className={expired ? styles.expired : styles.meta}>{expiryText}</p>
                        </div>
                      </div>
                      {expired ? (
                        <p className={styles.expiredMsg}>
                          Ce fichier a expiré, il n’est plus stocké chez nous
                        </p>
                      ) : (
                        <div className={styles.actions}>
                          {file.hasPassword ? <LockIcon /> : null}
                          <Button
                            variant="outline"
                            compact
                            icon={<TrashIcon />}
                            loading={deletingId === file.fileId}
                            onClick={() => void onDelete(file)}
                          >
                            Supprimer
                          </Button>
                          <Button
                            variant="outline"
                            compact
                            onClick={() => setShareFile(file)}
                          >
                            Accéder →
                          </Button>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
