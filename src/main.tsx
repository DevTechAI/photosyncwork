
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { QueryProvider } from './QueryProvider'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <UserProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </UserProvider>
  </BrowserRouter>
);
