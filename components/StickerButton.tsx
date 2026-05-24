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
    </button>
  );
}