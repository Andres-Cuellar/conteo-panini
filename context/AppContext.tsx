'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { loadAppState, saveAppState, generateId } from '@/lib/storage';
import { TEAMS, initializeStickers } from '@/lib/teams';
import { decodeSharedFromURL } from '@/lib/qr';

export interface Session {
  id: string;
  name: string;
  createdAt: number;
  stickers: Record<string, number[]>; // 0=missing, 1+=owned (2+=repeated)
}

export interface AppState {
  sessions: Session[];
  activeSessionId: string;
}

interface AppContextType {
  state: AppState;
  activeSession: Session | null;
  isInitialized: boolean;
  createSession: (name: string) => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, name: string) => void;
  setActiveSession: (id: string) => void;
  toggleSticker: (teamCode: string, stickerIndex: number) => void;
  markTeamStickers: (teamCode: string, owned: boolean) => void;
  addRepeated: (teamCode: string, stickerIndex: number) => void;
  removeRepeated: (teamCode: string, stickerIndex: number) => void;
  importSession: (session: Session) => void;
  exportCurrentSession: () => Session | null;
  getRepeatedCount: (teamCode: string, stickerIndex: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '16px',
      backgroundColor: '#0f1117',
      color: '#f5f5f7',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ fontSize: '3rem' }}>📘</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Panini 2026</div>
      <div style={{ color: '#8b8f9a' }}>Loading...</div>
    </div>
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loaded = loadAppState();
    setState(loaded);

    // Check for shared collection in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const share = params.get('share');
      if (share) {
        const sharedData = decodeSharedFromURL(share);
        if (sharedData) {
          setState((prev) => {
            if (!prev) return prev;
            const updatedSessions = prev.sessions.map((session) => {
              if (session.id !== prev.activeSessionId) return session;
              const newStickers = { ...session.stickers };
              Object.entries(sharedData.teams).forEach(([teamCode, missing]) => {
                const allOwned = Array(20).fill(1);
                missing.forEach((idx) => {
                  if (idx >= 1 && idx <= 20) {
                    allOwned[idx - 1] = 0;
                  }
                });
                newStickers[teamCode] = allOwned;
              });
              return { ...session, stickers: newStickers };
            });
            return { ...prev, sessions: updatedSessions };
          });
        }
      }
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && state) {
      saveAppState(state);
    }
  }, [state, isInitialized]);

  const activeSession = state?.sessions.find((s) => s.id === state.activeSessionId) || null;

  const getRepeatedCount = useCallback((teamCode: string, stickerIndex: number): number => {
    if (!activeSession) return 0;
    const stickers = activeSession.stickers[teamCode];
    if (!stickers || !stickers[stickerIndex]) return 0;
    return Math.max(0, stickers[stickerIndex] - 1);
  }, [activeSession]);

  const createSession = useCallback((name: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const now = Date.now();
      const newSession: Session = {
        id: generateId(),
        name,
        createdAt: now,
        stickers: {},
      };
      TEAMS.forEach((team) => {
        newSession.stickers[team.code] = initializeStickers();
      });
      return {
        sessions: [...prev.sessions, newSession],
        activeSessionId: newSession.id,
      };
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.sessions.length <= 1) return prev;
      const newSessions = prev.sessions.filter((s) => s.id !== id);
      const newActiveId = prev.activeSessionId === id ? newSessions[0].id : prev.activeSessionId;
      return {
        sessions: newSessions,
        activeSessionId: newActiveId,
      };
    });
  }, []);

  const renameSession = useCallback((id: string, name: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sessions: prev.sessions.map((s) => (s.id === id ? { ...s, name } : s)),
      };
    });
  }, []);

  const setActiveSession = useCallback((id: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        activeSessionId: id,
      };
    });
  }, []);

  // Toggle between missing (0) and owned (1)
  const toggleSticker = useCallback((teamCode: string, stickerIndex: number) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sessions: prev.sessions.map((session) => {
          if (session.id !== prev.activeSessionId) return session;
          const newStickers = [...session.stickers[teamCode]];
          newStickers[stickerIndex] = newStickers[stickerIndex] > 0 ? 0 : 1;
          return {
            ...session,
            stickers: {
              ...session.stickers,
              [teamCode]: newStickers,
            },
          };
        }),
      };
    });
  }, []);

  const markTeamStickers = useCallback((teamCode: string, owned: boolean) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sessions: prev.sessions.map((session) => {
          if (session.id !== prev.activeSessionId) return session;
          return {
            ...session,
            stickers: {
              ...session.stickers,
              [teamCode]: Array(20).fill(owned ? 1 : 0),
            },
          };
        }),
      };
    });
  }, []);

  // Add 1 to repeated count (max 99)
  const addRepeated = useCallback((teamCode: string, stickerIndex: number) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sessions: prev.sessions.map((session) => {
          if (session.id !== prev.activeSessionId) return session;
          const newStickers = [...session.stickers[teamCode]];
          // Ensure at least 1 before adding repeated
          if (newStickers[stickerIndex] === 0) {
            newStickers[stickerIndex] = 1;
          }
          // Add up to 99 total (1 base + 98 repeated)
          if (newStickers[stickerIndex] < 99) {
            newStickers[stickerIndex] += 1;
          }
          return {
            ...session,
            stickers: {
              ...session.stickers,
              [teamCode]: newStickers,
            },
          };
        }),
      };
    });
  }, []);

  // Remove 1 from repeated count (minimum 1 if owned, 0 if missing)
  const removeRepeated = useCallback((teamCode: string, stickerIndex: number) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sessions: prev.sessions.map((session) => {
          if (session.id !== prev.activeSessionId) return session;
          const newStickers = [...session.stickers[teamCode]];
          if (newStickers[stickerIndex] > 1) {
            newStickers[stickerIndex] -= 1;
          } else if (newStickers[stickerIndex] === 1) {
            // Reset to 0 (missing)
            newStickers[stickerIndex] = 0;
          }
          return {
            ...session,
            stickers: {
              ...session.stickers,
              [teamCode]: newStickers,
            },
          };
        }),
      };
    });
  }, []);

  const importSession = useCallback((session: Session) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        sessions: [...prev.sessions, session],
        activeSessionId: session.id,
      };
    });
  }, []);

  const exportCurrentSession = useCallback((): Session | null => {
    return activeSession;
  }, [activeSession]);

  if (!isInitialized || !state) {
    return <LoadingScreen />;
  }

  return (
    <AppContext.Provider
      value={{
        state,
        activeSession,
        isInitialized,
        createSession,
        deleteSession,
        renameSession,
        setActiveSession,
        toggleSticker,
        markTeamStickers,
        addRepeated,
        removeRepeated,
        importSession,
        exportCurrentSession,
        getRepeatedCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}