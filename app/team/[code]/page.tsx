'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppProvider, useApp } from '@/context/AppContext';
import StickerButton from '@/components/StickerButton';
import ProgressRing from '@/components/ProgressRing';
import { getTeamByCode, STICKERS_PER_TEAM } from '@/lib/teams';
import styles from './page.module.css';

function TeamDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { activeSession, toggleSticker, markTeamStickers } = useApp();

  const teamCode = params.code as string;
  const team = getTeamByCode(teamCode);

  const stats = useMemo(() => {
    if (!activeSession || !team) return { owned: 0, total: STICKERS_PER_TEAM, percentage: 0 };

    const stickers = activeSession.stickers[teamCode] || [];
    const owned = stickers.filter((count) => count > 0).length;

    return {
      owned,
      total: STICKERS_PER_TEAM,
      percentage: (owned / STICKERS_PER_TEAM) * 100,
    };
  }, [activeSession, teamCode, team]);

  const handleToggle = (index: number) => {
    toggleSticker(teamCode, index);
  };

  if (!team) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Team not found</h2>
          <button onClick={() => router.push('/')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const stickers = activeSession?.stickers[teamCode] || Array(20).fill(0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/')} type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.teamInfo}>
          <span className={styles.flag}>{team.flag}</span>
          <span className={styles.abbr}>{team.abbr}</span>
          <div className={styles.info}>
            <span className={styles.group}>Group {team.group}</span>
            <h1 className={styles.name}>{team.name}</h1>
          </div>
          <div className={styles.ring}>
            <ProgressRing percentage={stats.percentage} size={80} strokeWidth={6} showLabelText={false} />
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.owned}</span>
            <span className={styles.statLabel}>Owned</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.total - stats.owned}</span>
            <span className={styles.statLabel}>Missing</span>
          </div>
        </section>

        <section className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => markTeamStickers(teamCode, true)}
            type="button"
          >
            Mark All Owned
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnOutline}`}
            onClick={() => markTeamStickers(teamCode, false)}
            type="button"
          >
            Mark All Missing
          </button>
        </section>

        <section className={styles.stickerGrid}>
          {Array.from({ length: STICKERS_PER_TEAM }, (_, i) => (
            <StickerButton
              key={i}
              number={i + 1}
              owned={stickers[i] > 0}
              onClick={() => handleToggle(i)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default function TeamPage() {
  return (
    <AppProvider>
      <TeamDetailContent />
    </AppProvider>
  );
}