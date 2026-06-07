'use client';

import React, { useMemo } from 'react';
import styles from './ProgressBar.module.css';
import { useApp } from '@/context/AppContext';
import { TOTAL_STICKERS } from '@/lib/teams';

interface ProgressBarProps {
  owned?: number;
  total?: number;
}

export default function ProgressBar({ owned: propOwned, total: propTotal }: ProgressBarProps) {
  const { activeSession } = useApp();

  const stats = useMemo(() => {
    // If explicit props are provided, prefer them (useful for team-level progress)
    if (typeof propOwned === 'number' && typeof propTotal === 'number') {
      const owned = propOwned;
      const total = propTotal;
      const percentage = total > 0 ? (owned / total) * 100 : 0;
      return { percentage, owned, missing: total - owned };
    }

    // Fallback: compute across all teams (legacy behavior)
    if (!activeSession) return { percentage: 0, owned: 0, missing: TOTAL_STICKERS };

    let owned = 0;
    Object.values(activeSession.stickers).forEach((stickers) => {
      owned += (stickers as number[]).filter((count) => count > 0).length;
    });

    const percentage = TOTAL_STICKERS > 0 ? (owned / TOTAL_STICKERS) * 100 : 0;
    return { percentage, owned, missing: TOTAL_STICKERS - owned };
  }, [activeSession, propOwned, propTotal]);

  return (
    <section className={styles.progressSection}>
      <div className={styles.progressHeader}>
        <span className={styles.progressTitle}>Collection Progress</span>
        <span className={styles.progressTitle}>{Math.round(stats.percentage)}%</span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.min(100, Math.max(0, stats.percentage))}%` }}
        />
      </div>

      <div className={styles.progressStats}>
        <span>{stats.owned} stickers collected</span>
        <span>{stats.missing} stickers remaining</span>
      </div>
    </section>
  );
}
