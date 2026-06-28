export type Side = 'a' | 'b';

export interface Pick {
  a: number | null;
  b: number | null;
  adv?: Side;
}

export type PicksMap = Record<number, Pick>;

export interface Player {
  name: string;
  champion: string;
  picks: PicksMap;
}

export interface Me extends Player {}

export type LockState = 'open' | 'closed' | undefined;

export interface StandingRow {
  name: string;
  total: number;
  exact: number;
  champOk: boolean;
  me: boolean;
}

export interface Official {
  results: PicksMap;
  locks: Record<number, LockState>;
  standings: StandingRow[];
  updatedAt: number | null;
}

export interface RawR32Match {
  id: number;
  a: string;
  b: string;
  ko: string;
  venue: string;
}

export interface RawLaterMatch {
  id: number;
  fromA: number;
  fromB: number;
  ko: string;
}

export interface MatchDef {
  id: number;
  a: string | null;
  b: string | null;
  fromA: number | null;
  fromB: number | null;
  ko: string;
  venue: string;
}

export type RoundKey = 'R32' | 'R16' | 'QF' | 'SF' | 'FN';

export interface RoundDef {
  key: RoundKey;
  label: string;
  ids: number[];
}

export type Tab = 'pronos' | 'cuadro' | 'ranking' | 'org';

export interface PlayerCode {
  t: 'p';
  n: string;
  c: string;
  k: PicksMap;
}

export interface OfficialCode {
  t: 'o';
  r: PicksMap;
  l: Record<number, LockState>;
  c: string | null;
  s: StandingRow[];
  u: number;
}

export type ImportedCode = PlayerCode | OfficialCode;
