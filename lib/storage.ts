import { Session, AppState } from '@/context/AppContext';
import { TEAMS, initializeStickers } from './teams';

const STORAGE_KEY = 'panini-album-data';

export function loadAppState(): AppState {
  if (typeof window === 'undefined') {
    return createDefaultState();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AppState;
      if (parsed.sessions && parsed.sessions.length > 0) {
        // Handle legacy boolean arrays
        if (typeof parsed.sessions[0].stickers['bra']?.[0] === 'boolean') {
          parsed.sessions = parsed.sessions.map((session) => {
            const newStickers: Record<string, number[]> = {};
            Object.entries(session.stickers).forEach(([teamCode, stickers]) => {
              newStickers[teamCode] = (stickers as unknown as boolean[]).map((owned) => owned ? 1 : 0);
            });
            return { ...session, stickers: newStickers };
          });
        }
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load app state from localStorage:', error);
  }

  return createDefaultState();
}

export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save app state to localStorage:', error);
  }
}

function createDefaultState(): AppState {
  const now = Date.now();
  const defaultSession: Session = {
    id: generateId(),
    name: 'Mi Álbum',
    createdAt: now,
    stickers: {},
  };

  TEAMS.forEach((team) => {
    defaultSession.stickers[team.code] = initializeStickers();
  });

  return {
    sessions: [defaultSession],
    activeSessionId: defaultSession.id,
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function exportSessionData(session: Session): string {
  const data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    session: {
      name: session.name,
      createdAt: session.createdAt,
      stickers: session.stickers,
    },
  };
  return JSON.stringify(data, null, 2);
}

export function importSessionData(jsonString: string): Session | null {
  try {
    const data = JSON.parse(jsonString);

    if (!data.session || !data.session.name || !data.session.stickers) {
      console.warn('Invalid session data format');
      return null;
    }

    const now = Date.now();
    let stickers = data.session.stickers;

    // Handle version 1 (boolean arrays)
    if (typeof stickers['bra']?.[0] === 'boolean') {
      const newStickers: Record<string, number[]> = {};
      Object.entries(stickers).forEach(([teamCode, s]) => {
        newStickers[teamCode] = (s as unknown as boolean[]).map((owned) => owned ? 1 : 0);
      });
      stickers = newStickers;
    }

    const session: Session = {
      id: generateId(),
      name: data.session.name,
      createdAt: now,
      stickers,
    };

    const allTeams = Object.keys(session.stickers);
    if (allTeams.length === 0) {
      console.warn('Session has no stickers data');
      return null;
    }

    return session;
  } catch (error) {
    console.warn('Failed to parse session data:', error);
    return null;
  }
}

export function downloadJSON(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}