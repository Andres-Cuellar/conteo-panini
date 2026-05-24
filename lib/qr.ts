import { TEAMS } from './teams';

export interface SharedCollection {
  share: number;
  teams: Record<string, number[]>;
}

export function encodeMissingToURL(stickers: Record<string, boolean[]>): string {
  const teams: Record<string, number[]> = {};

  TEAMS.forEach((team) => {
    const owned = stickers[team.code];
    if (owned) {
      const missingIndices: number[] = [];
      owned.forEach((isOwned, index) => {
        if (!isOwned) {
          missingIndices.push(index + 1);
        }
      });
      if (missingIndices.length > 0) {
        teams[team.code] = missingIndices;
      }
    }
  });

  const shareData: SharedCollection = {
    share: 1,
    teams,
  };

  const encoded = btoa(JSON.stringify(shareData));
  return `?share=${encoded}`;
}

export function decodeSharedFromURL(encoded: string): SharedCollection | null {
  try {
    const decoded = JSON.parse(atob(encoded));
    if (decoded.share === 1 && decoded.teams) {
      return decoded as SharedCollection;
    }
    return null;
  } catch (error) {
    console.warn('Failed to decode shared collection:', error);
    return null;
  }
}

export function parseMissingTeams(params: URLSearchParams): Record<string, number[]> {
  const teams: Record<string, number[]> = {};

  TEAMS.forEach((team) => {
    const value = params.get(team.code);
    if (value) {
      const indices = value.split('-').map(Number).filter((n) => !isNaN(n) && n >= 1 && n <= 20);
      if (indices.length > 0) {
        teams[team.code] = indices;
      }
    }
  });

  return teams;
}