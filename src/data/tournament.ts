import type { MatchDef, RawLaterMatch, RawR32Match, RoundDef } from '../types';

export const TEAMS: Record<string, [string, string]> = {
  ZAF: ['Sudáfrica', '🇿🇦'], CAN: ['Canadá', '🇨🇦'], BRA: ['Brasil', '🇧🇷'], JPN: ['Japón', '🇯🇵'],
  GER: ['Alemania', '🇩🇪'], PAR: ['Paraguay', '🇵🇾'], NED: ['Países Bajos', '🇳🇱'], MAR: ['Marruecos', '🇲🇦'],
  CIV: ['Costa de Marfil', '🇨🇮'], NOR: ['Noruega', '🇳🇴'], FRA: ['Francia', '🇫🇷'], SWE: ['Suecia', '🇸🇪'],
  MEX: ['México', '🇲🇽'], ECU: ['Ecuador', '🇪🇨'], ENG: ['Inglaterra', '🏴'], COD: ['RD Congo', '🇨🇩'],
  BEL: ['Bélgica', '🇧🇪'], SEN: ['Senegal', '🇸🇳'], USA: ['Estados Unidos', '🇺🇸'], BIH: ['Bosnia y H.', '🇧🇦'],
  ESP: ['España', '🇪🇸'], AUT: ['Austria', '🇦🇹'], POR: ['Portugal', '🇵🇹'], CRO: ['Croacia', '🇭🇷'],
  SUI: ['Suiza', '🇨🇭'], ALG: ['Argelia', '🇩🇿'], AUS: ['Australia', '🇦🇺'], EGY: ['Egipto', '🇪🇬'],
  ARG: ['Argentina', '🇦🇷'], CPV: ['Cabo Verde', '🇨🇻'], COL: ['Colombia', '🇨🇴'], GHA: ['Ghana', '🇬🇭'],
};

const R32_RAW: [number, string, string, string, string][] = [
  [73, 'ZAF', 'CAN', '2026-06-28T23:00:00Z', 'Los Ángeles'],
  [74, 'GER', 'PAR', '2026-06-29T17:00:00Z', 'Boston'],
  [75, 'NED', 'MAR', '2026-06-29T21:00:00Z', 'Monterrey'],
  [76, 'BRA', 'JPN', '2026-06-29T21:00:00Z', 'Houston'],
  [77, 'FRA', 'SWE', '2026-06-30T17:00:00Z', 'Nueva York/NJ'],
  [78, 'CIV', 'NOR', '2026-06-30T21:00:00Z', 'Dallas'],
  [79, 'MEX', 'ECU', '2026-07-01T01:00:00Z', 'Ciudad de México'],
  [80, 'ESP', 'AUT', '2026-07-01T23:00:00Z', 'Los Ángeles'],
  [81, 'USA', 'BIH', '2026-07-02T00:00:00Z', 'Bahía de SF'],
  [82, 'BEL', 'SEN', '2026-07-02T00:00:00Z', 'Seattle'],
  [83, 'COL', 'GHA', '2026-07-04T01:30:00Z', 'Kansas City'],
  [84, 'ENG', 'COD', '2026-07-02T20:00:00Z', 'Atlanta'],
  [85, 'SUI', 'ALG', '2026-07-03T23:00:00Z', 'Vancouver'],
  [86, 'ARG', 'CPV', '2026-07-03T22:00:00Z', 'Miami'],
  [87, 'POR', 'CRO', '2026-07-03T20:00:00Z', 'Toronto'],
  [88, 'AUS', 'EGY', '2026-07-03T18:00:00Z', 'Dallas'],
];

const R16_RAW: [number, string, string, string, string][] = [
  [89, 'CAN', 'MAR', '2026-07-04T17:00:00Z', 'Houston'],
  [90, 'PAR', 'FRA', '2026-07-04T21:00:00Z', 'Filadelfia'],
  [91, 'BRA', 'NOR', '2026-07-05T20:00:00Z', 'Nueva York/NJ'],
  [92, 'MEX', 'ENG', '2026-07-06T00:00:00Z', 'Ciudad de México'],
  [93, 'POR', 'ESP', '2026-07-06T19:00:00Z', 'Arlington'],
  [94, 'USA', 'BEL', '2026-07-06T21:00:00Z', 'Seattle'],
  [95, 'ARG', 'EGY', '2026-07-07T16:00:00Z', 'Atlanta'],
  [96, 'SUI', 'COL', '2026-07-07T20:00:00Z', 'Vancouver'],
];

const LATER_RAW: [number, number, number, string, string][] = [
  [97,  89,  90,  '2026-07-09T20:00:00Z', 'Foxborough'],
  [98,  93,  94,  '2026-07-10T19:00:00Z', 'Los Ángeles'],
  [99,  91,  92,  '2026-07-11T21:00:00Z', 'Miami'],
  [100, 95,  96,  '2026-07-12T00:00:00Z', 'Kansas City'],
  [101, 97,  98,  '2026-07-15T00:00:00Z', 'Dallas'],
  [102, 99,  100, '2026-07-15T23:00:00Z', 'Atlanta'],
  [104, 101, 102, '2026-07-19T19:00:00Z', 'Nueva York/NJ'],
];

export const R32: RawR32Match[] = R32_RAW.map(([id, a, b, ko, venue]) => ({ id, a, b, ko, venue }));
export const R16: RawR32Match[] = R16_RAW.map(([id, a, b, ko, venue]) => ({ id, a, b, ko, venue }));
export const LATER: RawLaterMatch[] = LATER_RAW.map(([id, fromA, fromB, ko]) => ({ id, fromA, fromB, ko }));
const LATER_VENUE: Record<number, string> = Object.fromEntries(LATER_RAW.map(([id, , , , v]) => [id, v]));

export const ROUNDS: RoundDef[] = [
  { key: 'R32', label: 'Dieciseisavos', ids: [73, 75, 74, 77, 76, 78, 79, 80, 83, 84, 81, 82, 86, 88, 85, 87] },
  { key: 'R16', label: 'Octavos', ids: [90, 89, 91, 92, 93, 94, 95, 96] },
  { key: 'QF', label: 'Cuartos', ids: [97, 98, 99, 100] },
  { key: 'SF', label: 'Semis', ids: [101, 102] },
  { key: 'FN', label: 'Final', ids: [104] },
];

export function buildMatches(): Record<number, MatchDef> {
  const m: Record<number, MatchDef> = {};
  [...R32, ...R16].forEach((r) => {
    m[r.id] = { id: r.id, a: r.a, b: r.b, ko: r.ko, venue: r.venue, fromA: null, fromB: null };
  });
  LATER.forEach((r) => {
    m[r.id] = { id: r.id, a: null, b: null, ko: r.ko, fromA: r.fromA, fromB: r.fromB, venue: LATER_VENUE[r.id] ?? '' };
  });
  return m;
}

export function roundOf(id: number): RoundDef['key'] {
  if (id <= 88) return 'R32';
  if (id <= 96) return 'R16';
  if (id <= 100) return 'QF';
  if (id <= 102) return 'SF';
  return 'FN';
}

export function roundLabel(k: string): string {
  return ROUNDS.find((r) => r.key === k)?.label ?? '';
}

export function tName(code: string | null | undefined): string | null {
  return code && TEAMS[code] ? TEAMS[code][0] : null;
}

export function tFlag(code: string | null | undefined): string {
  return code && TEAMS[code] ? TEAMS[code][1] : '⬜';
}
