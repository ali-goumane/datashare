import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { useAuth } from './hooks/useAuth'
import { DownloadPage } from './pages/DownloadPage'
import { EspacePage } from './pages/EspacePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { UploadPage } from './pages/UploadPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth()
  if (loading) return <div className="page-loader">Chargement…</div>
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/download/:token" element={<DownloadPage />} />
        <Route path="/espace" element={<ProtectedRoute><EspacePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default App
