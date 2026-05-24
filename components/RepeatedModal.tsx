'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { TEAMS } from '@/lib/teams';
import styles from './RepeatedModal.module.css';

interface RepeatedModalProps {
  onClose: () => void;
}

export default function RepeatedModal({ onClose }: RepeatedModalProps) {
  const { activeSession, addRepeated, removeRepeated } = useApp();

  const ownedItems = useMemo(() => {
    if (!activeSession) return [];

    return TEAMS
      .map((team) => {
        const stickers = activeSession.stickers[team.code] || [];
        const owned: { sticker: number; count: number }[] = [];

        stickers.forEach((count, idx) => {
          if (count > 0) {
            owned.push({ sticker: idx + 1, count });
          }
        });

        if (owned.length === 0) return null;
        return {
          code: team.code,
          name: team.name,
          flag: team.flag,
          owned,
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);
  }, [activeSession]);

  const totalOwned = useMemo(() => {
    return ownedItems.reduce((acc, team) => acc + team.owned.length, 0);
  }, [ownedItems]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Mis Láminas</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.totalBadge}>
            <span className={styles.totalNumber}>{totalOwned}</span>
            <span className={styles.totalLabel}>láminas obtenidas</span>
          </div>

          <div className={styles.teamGrid}>
            {ownedItems.map((team) => (
              <div key={team.code} className={styles.teamCard}>
                <div className={styles.teamHeader}>
                  <span className={styles.teamFlag}>{team.flag}</span>
                  <span className={styles.teamName}>{team.name}</span>
                  <span className={styles.teamCount}>{team.owned.length}</span>
                </div>
                <div className={styles.stickerGrid}>
                  {team.owned.map(({ sticker, count }) => (
                    <div key={sticker} className={styles.stickerCell}>
                      <button
                        className={styles.stickerNum}
                        onClick={() => addRepeated(team.code, sticker - 1)}
                        type="button"
                      >
                        {sticker}
                      </button>
                      {count > 1 && (
                        <>
                          <span className={styles.countBadge}>{count}</span>
                          <button
                            className={styles.minusBtn}
                            onClick={() => removeRepeated(team.code, sticker - 1)}
                            type="button"
                          >
                            −
                          </button>
                        </>
                      )}
                    </div>
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