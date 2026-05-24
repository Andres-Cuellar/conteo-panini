'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import styles from './SessionSelector.module.css';

export default function SessionSelector() {
  const { state, activeSession, createSession, deleteSession, renameSession, setActiveSession } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setEditingId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreate = () => {
    if (newName.trim()) {
      createSession(newName.trim());
      setNewName('');
      setIsCreating(false);
      setIsOpen(false);
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      renameSession(id, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDelete = (id: string) => {
    if (state && state.sessions.length > 1) {
      deleteSession(id);
    }
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)} type="button">
        <span className={styles.label}>{activeSession?.name || 'Select Session'}</span>
        <svg className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.list}>
            {state?.sessions.map((session) => (
              <div
                key={session.id}
                className={`${styles.item} ${session.id === activeSession?.id ? styles.itemActive : ''}`}
              >
                {editingId === session.id ? (
                  <div className={styles.editForm}>
                    <input
                      ref={inputRef}
                      className={styles.editInput}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(session.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <button className={styles.iconBtn} onClick={() => handleRename(session.id)} type="button">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className={styles.sessionBtn}
                      onClick={() => {
                        setActiveSession(session.id);
                        setIsOpen(false);
                      }}
                      type="button"
                    >
                      {session.name}
                    </button>
                    <div className={styles.actions}>
                      <button
                        className={styles.iconBtn}
                        onClick={() => {
                          setEditingId(session.id);
                          setEditName(session.name);
                        }}
                        type="button"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {state.sessions.length > 1 && (
                        <button
                          className={`${styles.iconBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDelete(session.id)}
                          type="button"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {isCreating ? (
            <div className={styles.createForm}>
              <input
                ref={inputRef}
                className={styles.createInput}
                placeholder="Session name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
              />
              <button className={styles.createBtn} onClick={handleCreate} type="button">
                Create
              </button>
            </div>
          ) : (
            <button className={styles.newBtn} onClick={() => setIsCreating(true)} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Session
            </button>
          )}
        </div>
      )}
    </div>
  );
}