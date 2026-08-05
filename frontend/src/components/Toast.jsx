import React from 'react';
import { useToast } from '../hooks/useToast';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 9999
    }}>
      {toasts.map(toast => {
        let bgColor = '#22C55E'; // success
        if (toast.type === 'error') bgColor = '#EF4444';
        if (toast.type === 'warning') bgColor = '#F59E0B';

        return (
          <div key={toast.id} style={{
            backgroundColor: bgColor,
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '250px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <span>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
