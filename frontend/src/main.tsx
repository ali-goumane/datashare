import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './hooks/useAuth'
import { applyDesignTokens } from './styles/applyDesignTokens'
import App from './App'
import './styles/theme.css'
import './index.css'

applyDesignTokens()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
