import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter here
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CountriesProvider } from './context/CountriesContext';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> 
      <AuthProvider>
      <CountriesProvider>
        <App />
      </CountriesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);