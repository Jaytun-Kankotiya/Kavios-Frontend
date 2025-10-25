import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import ImageProvider from './context/ImageContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImageProvider>
      <App />
    </ImageProvider>
  </StrictMode>
)
