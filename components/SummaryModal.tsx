'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { TEAMS, GROUPS } from '@/lib/teams';
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
        const missing: number[] = [];

        stickers.forEach((count, idx) => {
          if (count === 0) {
            missing.push(idx + 1);
          }
        });

        if (missing.length === 0) return null;
        return {
          code: team.code,
          name: team.name,
          abbr: team.abbr,
          flag: team.flag,
          group: team.group,
          missing,
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);
  }, [activeSession]);

  const totalMissing = useMemo(() => {
    return missingSummary.reduce((acc, team) => acc + team.missing.length, 0);
  }, [missingSummary]);

  // Group items by group letter
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof missingSummary> = {};
    missingSummary.forEach((team) => {
      if (!groups[team.group]) {
        groups[team.group] = [];
      }
      groups[team.group].push(team);
    });
    return groups;
  }, [missingSummary]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Faltantes</h2>
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
            <span className={styles.totalLabel}>láminas faltantes</span>
          </div>

          <div className={styles.groupedList}>
            {GROUPS.map((group) => {
              const teams = groupedItems[group];
              if (!teams || teams.length === 0) return null;

              return (
                <div key={group} className={styles.groupSection}>
                  <div className={styles.groupHeader}>
                    <span className={styles.groupBadge}>{group}</span>
                    <span className={styles.groupTitle}>Group {group}</span>
                  </div>
                  <div className={styles.teamList}>
                    {teams.map((team) => (
                      <div key={team.code} className={styles.teamItem}>
                        <div className={styles.teamHeader}>
                          <span className={styles.teamFlag}>{team.flag}</span>
                          <span className={styles.teamName}>{team.name}</span>
                          <span className={styles.teamAbbr}>{team.abbr}</span>
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}