import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import LoadingScreen from './components/LoadingScreen'

const root = document.getElementById('root')!

// Render app immediately behind the loader
createRoot(root).render(
  <StrictMode>
    <LoadingScreen />
    <App />
  </StrictMode>
)

// Fade out loader after 2.2 seconds
setTimeout(() => {
  const loader = document.getElementById('loader')
  if (loader) {
    loader.classList.add('loader-hidden')
  }
}, 2200)
