'use client';

import React from 'react';
import styles from './StickerButton.module.css';

interface StickerButtonProps {
  number: number;
  count: number;
  onClick: () => void;
  onRemove?: () => void;
}

export default function StickerButton({ number, count, onClick, onRemove }: StickerButtonProps) {
  const owned = count > 0;

  return (
    <button
      className={`${styles.button} ${owned ? styles.owned : styles.missing}`}
      onClick={onClick}
      type="button"
    >
      <span className={styles.number}>{number}</span>
      {count > 1 && (
        <span className={styles.countBadge}>{count - 1}</span>
      )}
      {count > 1 && onRemove && (
        <span
          className={styles.minusBtn}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onRemove();
            }
          }}
        >
          −
        </span>
      )}
    </button>
  );
}