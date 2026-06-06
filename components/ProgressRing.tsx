'use client';

import React, { useMemo } from 'react';
import styles from './ProgressRing.module.css';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  showLabelText?: boolean;
}

export default function ProgressRing({
  percentage,
  size = 180,
  strokeWidth = 12,
  showLabel = true,
  showLabelText = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const color = useMemo(() => {
    if (percentage === 100) return 'var(--success)';
    if (percentage >= 75) return 'var(--accent-secondary)';
    if (percentage >= 50) return 'var(--warning)';
    return 'var(--accent-primary)';
  }, [percentage]);

  const fontSize = useMemo(() => {
    if (size <= 100) return '1rem';
    if (size <= 150) return '1rem';
    return '1rem';
  }, [size]);

  const small = size <= 100;

  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <svg className={styles.svg} width={size} height={size}>
        <circle
          className={styles.bg} 
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={styles.progress}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ stroke: color }}
        />
      </svg>
      {showLabel && (
        <div className={styles.label}>
          <span className={styles.percentage} style={{ fontSize }}>{Math.round(percentage)}</span>
          <span className={styles.percent}>%</span>
          {showLabelText && !small && (
            <span className={styles.labelText}>Complete</span>
          )}
        </div>
      )}
    </div>
  );
}