import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Entry Point React Application
 * E-Office BKSDA Jawa Tengah
 *
 * Inisialisasi React 18 createRoot
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
