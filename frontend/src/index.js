import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Redirect to dashboard if logged in
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
if (token && role) {
  if (role === 'admin') {
    window.location.href = '/admin';
  } else {
    window.location.href = '/farmer';
  }
}
