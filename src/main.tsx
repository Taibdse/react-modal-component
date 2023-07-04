import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ModalProvider from './providers/ModalProvider/index.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  // </React.StrictMode>
  ,
)
