import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from 'react'
import styles from './FileDropzone.module.css'
import { formatFileSize } from '../utils/format'

type FileDropzoneProps = {
  files: File[]
  onChange: (files: File[]) => void
  multiple?: boolean
  disabled?: boolean
  onFileChosen?: (file: File) => void
}

export function FileDropzone({
  files,
  onChange,
  multiple = false,
  disabled = false,
  onFileChosen,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      const next = Array.from(list)
      if (!next.length) return
      onChange(multiple ? [...files, ...next] : [next[0]])
      onFileChosen?.(next[0])
    },
    [files, multiple, onChange, onFileChosen],
  )

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    if (disabled) return
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files)
    }
  }

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!disabled) setDragging(true)
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      addFiles(event.target.files)
      event.target.value = ''
    }
  }

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={[styles.zone, dragging ? styles.dragging : ''].filter(Boolean).join(' ')}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragging(false)}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onKeyDown={(event) => {
          if (disabled) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onClick={() => {
          if (!disabled) inputRef.current?.click()
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className={styles.hiddenInput}
          multiple={multiple}
          disabled={disabled}
          onChange={onInputChange}
          aria-label="Choisir un fichier"
        />
        <div className={styles.icon} aria-hidden="true">
          📤
        </div>
        <p className={styles.title}>Glissez-déposez votre fichier ici</p>
        <p className={styles.subtitle}>ou cliquez pour parcourir vos dossiers</p>
        <span className={styles.limits}>Taille max : 1 Go. Fichiers .exe/.bat interdits.</span>
      </div>

      {files.length > 0 ? (
        <ul className={styles.list} aria-label="Fichiers sélectionnés">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${index}`} className={styles.item}>
              <div className={styles.meta}>
                <span className={styles.name}>{file.name}</span>
                <span className={styles.size}>{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                className={styles.remove}
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                aria-label={`Retirer ${file.name}`}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
