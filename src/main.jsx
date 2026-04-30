import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { WatchlistProvider } from './context/WatchlistContext'
import { WatchHistoryProvider } from './context/WatchHistoryContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WatchlistProvider>
        <WatchHistoryProvider>
          <App />
        </WatchHistoryProvider>
      </WatchlistProvider>
    </AuthProvider>
  </StrictMode>,
)
