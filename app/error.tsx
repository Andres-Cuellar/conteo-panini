'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    document.body.style.backgroundColor = '#0f1117';
    document.body.style.color = '#f5f5f7';
  }, []);

  return (
    <html lang="es">
      <body style={{
        backgroundColor: '#0f1117',
        color: '#f5f5f7',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        margin: 0,
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📘</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Something went wrong</h1>
        <p style={{ color: '#8b8f9a', marginBottom: '24px' }}>{error.message}</p>
        <button
          onClick={reset}
          style={{
            padding: '12px 24px',
            backgroundColor: '#e63946',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}