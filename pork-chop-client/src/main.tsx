import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/sizzle-base.css'
import './theme/sizzle-tokens.css'
import './theme/sizzle-layout.css';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
