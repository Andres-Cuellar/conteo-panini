'use client';

import React from 'react';
import Link from 'next/link';
import styles from './TeamCard.module.css';

interface TeamCardProps {
  code: string;
  name: string;
  abbr: string;
  flag: string;
  group: string;
  ownedCount: number;
  totalCount?: number;
}

export default function TeamCard({
  code,
  name,
  abbr,
  flag,
  group,
  ownedCount,
  totalCount = 20,
}: TeamCardProps) {
  return (
    <Link href={`/team/${code}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.flag}>{flag}</span>
        <div className={styles.info}>
          <span className={styles.group}>Group {group}</span>
          <span className={styles.name}>{name}</span>
        </div>
        <span className={styles.abbr}>{abbr}</span>
      </div>
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(ownedCount / totalCount) * 100}%` }}
          />
        </div>
        <div className={styles.count}>
          <span className={styles.countOwned}>{ownedCount}</span>
          <span>/ {totalCount}</span>
        </div>
      </div>
    </Link>
  );
}