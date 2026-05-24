export interface Team {
  code: string;
  name: string;
  flag: string;
  group: string;
}

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const;

export const TEAMS: Team[] = [
  { code: 'mex', name: 'México', flag: '🇲🇽', group: 'A' },
  { code: 'rsa', name: 'Sudáfrica', flag: '🇿🇦', group: 'A' },
  { code: 'kor', name: 'Corea del Sur', flag: '🇰🇷', group: 'A' },
  { code: 'cze', name: 'República Checa', flag: '🇨🇿', group: 'A' },
  { code: 'can', name: 'Canadá', flag: '🇨🇦', group: 'B' },
  { code: 'bih', name: 'Bosnia y Herzegovina', flag: '🇧🇦', group: 'B' },
  { code: 'qat', name: 'Catar', flag: '🇶🇦', group: 'B' },
  { code: 'sui', name: 'Suiza', flag: '🇨🇭', group: 'B' },
  { code: 'bra', name: 'Brasil', flag: '🇧🇷', group: 'C' },
  { code: 'mar', name: 'Marruecos', flag: '🇲🇦', group: 'C' },
  { code: 'hai', name: 'Haití', flag: '🇭🇹', group: 'C' },
  { code: 'sco', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  { code: 'usa', name: 'Estados Unidos', flag: '🇺🇸', group: 'D' },
  { code: 'par', name: 'Paraguay', flag: '🇵🇾', group: 'D' },
  { code: 'aus', name: 'Australia', flag: '🇦🇺', group: 'D' },
  { code: 'tur', name: 'Turquía', flag: '🇹🇷', group: 'D' },
  { code: 'ger', name: 'Alemania', flag: '🇩🇪', group: 'E' },
  { code: 'cuw', name: 'Curazao', flag: '🇨🇼', group: 'E' },
  { code: 'civ', name: 'Costa de Marfil', flag: '🇨🇮', group: 'E' },
  { code: 'ecu', name: 'Ecuador', flag: '🇪🇨', group: 'E' },
  { code: 'ned', name: 'Países Bajos', flag: '🇳🇱', group: 'F' },
  { code: 'jpn', name: 'Japón', flag: '🇯🇵', group: 'F' },
  { code: 'swe', name: 'Suecia', flag: '🇸🇪', group: 'F' },
  { code: 'tun', name: 'Túnez', flag: '🇹🇳', group: 'F' },
  { code: 'bel', name: 'Bélgica', flag: '🇧🇪', group: 'G' },
  { code: 'egy', name: 'Egipto', flag: '🇪🇬', group: 'G' },
  { code: 'irn', name: 'Irán', flag: '🇮🇷', group: 'G' },
  { code: 'nzl', name: 'Nueva Zelanda', flag: '🇳🇿', group: 'G' },
  { code: 'esp', name: 'España', flag: '🇪🇸', group: 'H' },
  { code: 'cpv', name: 'Cabo Verde', flag: '🇨🇻', group: 'H' },
  { code: 'ksa', name: 'Arabia Saudita', flag: '🇸🇦', group: 'H' },
  { code: 'uru', name: 'Uruguay', flag: '🇺🇾', group: 'H' },
  { code: 'fra', name: 'Francia', flag: '🇫🇷', group: 'I' },
  { code: 'sen', name: 'Senegal', flag: '🇸🇳', group: 'I' },
  { code: 'irq', name: 'Irak', flag: '🇮🇶', group: 'I' },
  { code: 'nor', name: 'Noruega', flag: '🇳🇴', group: 'I' },
  { code: 'arg', name: 'Argentina', flag: '🇦🇷', group: 'J' },
  { code: 'alg', name: 'Argelia', flag: '🇩🇿', group: 'J' },
  { code: 'aut', name: 'Austria', flag: '🇦🇹', group: 'J' },
  { code: 'jor', name: 'Jordania', flag: '🇯🇴', group: 'J' },
  { code: 'por', name: 'Portugal', flag: '🇵🇹', group: 'K' },
  { code: 'cod', name: 'RD Congo', flag: '🇨🇩', group: 'K' },
  { code: 'uzb', name: 'Uzbekistán', flag: '🇺🇿', group: 'K' },
  { code: 'col', name: 'Colombia', flag: '🇨🇴', group: 'K' },
  { code: 'eng', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  { code: 'cro', name: 'Croacia', flag: '🇭🇷', group: 'L' },
  { code: 'gha', name: 'Ghana', flag: '🇬🇭', group: 'L' },
  { code: 'pan', name: 'Panamá', flag: '🇵🇦', group: 'L' },
];

export const TEAM_COUNT = 48;
export const STICKERS_PER_TEAM = 20;
export const TOTAL_STICKERS = TEAM_COUNT * STICKERS_PER_TEAM;

export function getTeamsByGroup(group: string): Team[] {
  return TEAMS.filter((team) => team.group === group);
}

export function getTeamByCode(code: string): Team | undefined {
  return TEAMS.find((team) => team.code === code);
}

export function initializeStickers(): boolean[] {
  return Array(STICKERS_PER_TEAM).fill(false);
}