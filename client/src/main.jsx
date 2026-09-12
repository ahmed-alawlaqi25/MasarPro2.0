import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App"
import "./utils/i18n"
import {BrowserRouter} from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
