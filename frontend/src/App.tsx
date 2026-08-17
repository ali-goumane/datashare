import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { DownloadPage } from './pages/DownloadPage'
import { EspacePage } from './pages/EspacePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { UploadPage } from './pages/UploadPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="espace" element={<EspacePage />} />
        <Route element={<AppLayout />}>
          <Route index element={<UploadPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="download/:token" element={<DownloadPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
