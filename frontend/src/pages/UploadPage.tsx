import { useRef, useState } from 'react'
import { UploadForm } from '../components/UploadForm'
import { UploadCloudIcon } from '../components/Icons'
import styles from './UploadPage.module.css'

export function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  if (file) {
    return (
      <UploadForm
        variant="public"
        initialFile={file}
        onBack={() => setFile(null)}
        onFileChange={setFile}
      />
    )
  }

  return (
    <div className={styles.landing}>
      <h1 className={styles.headline}>Tu veux partager un fichier ?</h1>
      <button
        type="button"
        className={styles.uploadCircle}
        onClick={() => inputRef.current?.click()}
        aria-label="Ajouter un fichier"
      >
        <span className={styles.innerCircle}>
          <UploadCloudIcon size={44} />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        className={styles.hidden}
        onChange={(e) => {
          const next = e.target.files?.[0] ?? null
          if (next) setFile(next)
          e.target.value = ''
        }}
      />
    </div>
  )
}
