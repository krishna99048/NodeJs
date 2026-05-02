import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import Usercontent from './content/usercontenxt.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Usercontent>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Usercontent>
  </StrictMode>,
)
