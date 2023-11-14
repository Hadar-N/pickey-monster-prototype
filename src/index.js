import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { ConnectionProvider } from './utils/ConnectionContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
    <ConnectionProvider>
      <App />
      </ConnectionProvider>
    </HashRouter>
  </React.StrictMode>
);
