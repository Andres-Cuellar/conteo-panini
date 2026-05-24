'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useApp } from '@/context/AppContext';
import { encodeMissingToURL } from '@/lib/qr';
import styles from './QRModal.module.css';

interface QRModalProps {
  onClose: () => void;
}

export default function QRModal({ onClose }: QRModalProps) {
  const { activeSession } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeSession) {
      const encoded = encodeMissingToURL(activeSession.stickers);
      const fullUrl = `${window.location.origin}${window.location.pathname}${encoded}`;
      setShareUrl(fullUrl);

      QRCode.toDataURL(fullUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#f5f5f7',
          light: '#0f1117',
        },
      }).then(setQrDataUrl);
    }
  }, [activeSession]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy URL:', err);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Share QR</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {qrDataUrl && (
            <div className={styles.qrWrapper}>
              <img src={qrDataUrl} alt="QR Code" className={styles.qrCode} />
            </div>
          )}

          <p className={styles.hint}>Scan to import missing stickers</p>

          <button className={styles.copyBtn} onClick={handleCopy} type="button">
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Link Copied!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}