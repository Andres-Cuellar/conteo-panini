'use client';

import React, { useMemo, Suspense } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import ProgressRing from '@/components/ProgressRing';
import TeamCard from '@/components/TeamCard';
import SessionSelector from '@/components/SessionSelector';
import ActionBar from '@/components/ActionBar';
import { GROUPS, getTeamsByGroup, TOTAL_STICKERS } from '@/lib/teams';
import styles from './page.module.css';

function HeroStats() {
  const { activeSession } = useApp();

  const stats = useMemo(() => {
    if (!activeSession) return { owned: 0, total: TOTAL_STICKERS, percentage: 0, missing: TOTAL_STICKERS };

    let owned = 0;
    Object.values(activeSession.stickers).forEach((stickers) => {
      owned += stickers.filter(Boolean).length;
    });

    return {
      owned,
      total: TOTAL_STICKERS,
      percentage: (owned / TOTAL_STICKERS) * 100,
      missing: TOTAL_STICKERS - owned,
    };
  }, [activeSession]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroLeft}>
        <ProgressRing percentage={stats.percentage} size={200} strokeWidth={14} />
      </div>
      <div className={styles.heroRight}>
        <h2 className={styles.heroTitle}>World Cup<br />Sticker Album</h2>
        <p className={styles.heroSubtitle}>
          Haz un seguimiento de tu colección Panini del Mundial de la FIFA 2026. Completa las colecciones de las 48 selecciones nacionales para llenar tu álbum.        </p>
          <p>Desarrollado por <a href="https://instagram.com/felipec.ia" target="_blank" rel="noopener noreferrer">@felipec.ia</a></p>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.owned}</span>
            <span className={styles.statLabel}>Obtenidas</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.missing}</span>
            <span className={styles.statLabel}>Faltantes</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressBar() {
  const { activeSession } = useApp();

  const stats = useMemo(() => {
    if (!activeSession) return { percentage: 0, owned: 0, missing: TOTAL_STICKERS };

    let owned = 0;
    Object.values(activeSession.stickers).forEach((stickers) => {
      owned += stickers.filter(Boolean).length;
    });

    return {
      percentage: (owned / TOTAL_STICKERS) * 100,
      owned,
      missing: TOTAL_STICKERS - owned,
    };
  }, [activeSession]);

  return (
    <section className={styles.progressSection}>
      <div className={styles.progressHeader}>
        <span className={styles.progressTitle}>Collection Progress</span>
        <span className={styles.progressTitle}>{Math.round(stats.percentage)}%</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${stats.percentage}%` }}
        />
      </div>
      <div className={styles.progressStats}>
        <span>{stats.owned} stickers collected</span>
        <span>{stats.missing} stickers remaining</span>
      </div>
    </section>
  );
}

function TeamsGrid() {
  const { activeSession } = useApp();

  const getTeamOwnedCount = (teamCode: string): number => {
    if (!activeSession) return 0;
    const stickers = activeSession.stickers[teamCode];
    if (!stickers) return 0;
    return stickers.filter(Boolean).length;
  };

  return (
    <section className={styles.groups}>
      {GROUPS.map((group) => {
        const teams = getTeamsByGroup(group);
        const groupOwned = teams.reduce((acc, team) => acc + getTeamOwnedCount(team.code), 0);
        const groupTotal = teams.length * 20;

        return (
          <div key={group} className={styles.group}>
            <div className={styles.groupHeader}>
              <span className={styles.groupBadge}>{group}</span>
              <h3 className={styles.groupTitle}>Group {group}</h3>
              <span className={styles.groupCount}>{groupOwned}/{groupTotal}</span>
            </div>
            <div className={styles.teamGrid}>
              {teams.map((team, index) => (
                <div
                  key={team.code}
                  className={styles.teamWrapper}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <TeamCard
                    code={team.code}
                    name={team.name}
                    flag={team.flag}
                    group={team.group}
                    ownedCount={getTeamOwnedCount(team.code)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function DashboardContent() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📘</span>
          <h1 className={styles.title}>Panini 2026</h1>
        </div>
        <SessionSelector />
      </header>

      <main className={styles.main}>
        <Suspense fallback={<div className={styles.loading}>Loading stats...</div>}>
          <HeroStats />
        </Suspense>
        <Suspense fallback={<div className={styles.loading}>Loading progress...</div>}>
          <ProgressBar />
        </Suspense>
        <Suspense fallback={<div className={styles.loading}>Loading teams...</div>}>
          <TeamsGrid />
        </Suspense>
      </main>

      <ActionBar />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}