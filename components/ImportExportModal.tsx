'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { exportSessionData, importSessionData, downloadJSON } from '@/lib/storage';
import styles from './ImportExportModal.module.css';

interface ImportExportModalProps {
  onClose: () => void;
}

export default function ImportExportModal({ onClose }: ImportExportModalProps) {
  const { activeSession, importSession } = useApp();
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!activeSession) return;
    const data = exportSessionData(activeSession);
    const filename = `panini-${activeSession.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    downloadJSON(data, filename);
    setStatus('¡Exportado con éxito!');
    setIsError(false);
    setTimeout(() => setStatus(null), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const session = importSessionData(content);
      if (session) {
        importSession(session);
        setStatus('¡Sesión importada con éxito!');
        setIsError(false);
        setTimeout(() => {
          setStatus(null);
          onClose();
        }, 1500);
      } else {
        setStatus('Formato de archivo inválido');
        setIsError(true);
        setTimeout(() => setStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Importar / Exportar</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Exporta tu progreso para hacer un backup o comparte tu archivo. Importa un archivo JSON para recuperar tu colección.
          </p>

          <div className={styles.actions}>
            <button className={styles.exportBtn} onClick={handleExport} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Exportar
            </button>

            <button className={styles.importBtn} onClick={handleImportClick} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Importar
            </button>
          </div>

          {status && (
            <div className={`${styles.status} ${isError ? styles.error : ''}`}>
              {status}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>
      </div>
    </div>
  );
}