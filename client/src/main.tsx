import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SessionProvider } from './context/sessionContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <SessionProvider>
        <App />
    </SessionProvider>
)
