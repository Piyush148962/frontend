import React from 'react';
import { useApp } from '../../context/AppContext';
import './toast.css';

export default function ToastContainer(){
  const { toasts } = useApp();
  return (
    <div className="toast-root">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          <div className="toast-text">{t.text}</div>
        </div>
      ))}
    </div>
  );
}
