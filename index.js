import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// -----------------------------------------------
// Load saved theme BEFORE React renders (smooth)
// -----------------------------------------------
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// -----------------------------------------------
// React Root
// -----------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
