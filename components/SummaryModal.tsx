'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { TEAMS } from '@/lib/teams';
import styles from './SummaryModal.module.css';

interface SummaryModalProps {
  onClose: () => void;
}

export default function SummaryModal({ onClose }: SummaryModalProps) {
  const { activeSession } = useApp();

  const missingSummary = useMemo(() => {
    if (!activeSession) return [];

    return TEAMS
      .map((team) => {
        const stickers = activeSession.stickers[team.code] || [];
        const missing = stickers
          .map((owned, idx) => (!owned ? idx + 1 : null))
          .filter((n): n is number => n !== null);

        if (missing.length === 0) return null;
        return {
          code: team.code,
          name: team.name,
          flag: team.flag,
          missing,
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);
  }, [activeSession]);

  const totalMissing = useMemo(() => {
    return missingSummary.reduce((acc, team) => acc + team.missing.length, 0);
  }, [missingSummary]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Stickers faltantes</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.totalBadge}>
            <span className={styles.totalNumber}>{totalMissing}</span>
            <span className={styles.totalLabel}>Sticker faltantes</span>
          </div>

          <div className={styles.teamList}>
            {missingSummary.map((team) => (
              <div key={team.code} className={styles.teamItem}>
                <div className={styles.teamHeader}>
                  <span className={styles.teamFlag}>{team.flag}</span>
                  <span className={styles.teamName}>{team.name}</span>
                </div>
                <div className={styles.stickerList}>
                  {team.missing.map((num) => (
                    <span key={num} className={styles.stickerNum}>{num}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}