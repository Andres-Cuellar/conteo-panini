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
  const percentage = Math.round((ownedCount / totalCount) * 100);

  return (
    <Link href={`/team/${code}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.flag}>{flag}</span>
        <div className={styles.info}>
          <span className={styles.group}>Group {group}</span>
          <span className={styles.name}>{name}</span>
        </div>
        <span className={styles.abbr}>{abbr}</span>
        <span className={styles.percentage}>{percentage}%</span>
      </div>
    </Link>
  );
}