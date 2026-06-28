import type { Me, Official } from '../types';

const KEYS = {
  me: 'qm26_me',
  official: 'qm26_official',
  roster: 'qm26_roster',
};

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function loadMe(): Me | null {
  return read<Me>(KEYS.me);
}
export function loadOfficial(): Official | null {
  return read<Official>(KEYS.official);
}
export function loadRoster(): Me[] | null {
  return read<Me[]>(KEYS.roster);
}

export function saveMe(me: Me) {
  write(KEYS.me, me);
}
export function saveOfficial(official: Official) {
  write(KEYS.official, official);
}
export function saveRoster(roster: Me[]) {
  write(KEYS.roster, roster);
}
