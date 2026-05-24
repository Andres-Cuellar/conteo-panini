'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import SummaryModal from './SummaryModal';
import RepeatedModal from './RepeatedModal';
import ImportExportModal from './ImportExportModal';
import styles from './ActionBar.module.css';

export default function ActionBar() {
  const { activeSession } = useApp();
  const [showSummary, setShowSummary] = useState(false);
  const [showRepeated, setShowRepeated] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  const totalOwned = useMemo(() => {
    if (!activeSession) return 0;
    let count = 0;
    Object.values(activeSession.stickers).forEach((stickers) => {
      stickers.forEach((c) => {
        if (c > 0) count++;
      });
    });
    return count;
  }, [activeSession]);

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.buttons}>
          <button className={styles.btn} onClick={() => setShowImportExport(true)} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Backup
          </button>

          <button className={styles.btn} onClick={() => setShowSummary(true)} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Faltantes
          </button>

          <button className={styles.btn} onClick={() => setShowRepeated(true)} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            Mis Laminas
          </button>
        </div>

        <div className={styles.footer}>
          by <a href="https://instagram.com/felipec.ia" target="_blank" rel="noopener noreferrer">@felipec.ia</a> • <a href="https://creamostuweb.co" target="_blank" rel="noopener noreferrer">creamostuweb.co</a>
        </div>
      </div>

      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
      {showRepeated && <RepeatedModal onClose={() => setShowRepeated(false)} />}
      {showImportExport && <ImportExportModal onClose={() => setShowImportExport(false)} />}
    </>
  );
}