'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { exportSessionData, importSessionData, downloadJSON } from '@/lib/storage';
import QRModal from './QRModal';
import SummaryModal from './SummaryModal';
import styles from './ActionBar.module.css';

export default function ActionBar() {
  const { activeSession, importSession } = useApp();
  const [showQR, setShowQR] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!activeSession) return;
    const data = exportSessionData(activeSession);
    const filename = `panini-${activeSession.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    downloadJSON(data, filename);
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
        setImportStatus('Session imported successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Invalid file format');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.buttons}>
          <button className={styles.btn} onClick={handleExport} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>

          <button className={styles.btn} onClick={handleImportClick} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import
          </button>

          <button className={styles.btn} onClick={() => setShowSummary(true)} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Resumen
          </button>

          {/* <button className={`${styles.btn} ${styles.qrBtn}`} onClick={() => setShowQR(true)} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            QR
          </button> */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>

        <div className={styles.footer}>
          powered by <a href="https://creamostuweb.co" target="_blank" rel="noopener noreferrer">creamostuweb.co</a>
        </div>
      </div>

      {importStatus && (
        <div className={styles.status}>{importStatus}</div>
      )}

      {showQR && <QRModal onClose={() => setShowQR(false)} />}
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
    </>
  );
}