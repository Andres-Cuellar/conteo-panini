'use client';

import React from 'react';
import styles from './StickerButton.module.css';

interface StickerButtonProps {
  number: number;
  owned: boolean;
  onClick: () => void;
}

export default function StickerButton({ number, owned, onClick }: StickerButtonProps) {
  return (
    <button
      className={`${styles.button} ${owned ? styles.owned : styles.missing}`}
      onClick={onClick}
      type="button"
    >
      <span className={styles.number}>{number}</span>
      {owned && (
        <svg className={styles.check} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}