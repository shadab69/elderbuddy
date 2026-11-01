import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { installAdminTokenInterceptor } from './utils/adminToken.js';

installAdminTokenInterceptor();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
