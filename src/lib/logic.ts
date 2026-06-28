import { ROUNDS, buildMatches } from '../data/tournament';
import type { Official, Pick, PicksMap, Side, StandingRow } from '../types';

const MATCHES = buildMatches();

export function getMatch(id: number) {
  return MATCHES[id];
}

export function winner(res: Pick | null | undefined): Side | null {
  if (!res || res.a == null || res.b == null) return null;
  if (res.a > res.b) return 'a';
  if (res.b > res.a) return 'b';
  return res.adv ?? null;
}

export function teamOf(results: PicksMap, id: number, side: Side): string | null {
  const m = MATCHES[id];
  if (!m) return null;
  if (m.fromA == null) return side === 'a' ? m.a : m.b;
  const feeder = side === 'a' ? m.fromA! : m.fromB!;
  const w = winner(results[feeder]);
  if (!w) return null;
  return teamOf(results, feeder, w);
}

export function champOf(results: PicksMap): string | null {
  const w = winner(results[104]);
  return w ? teamOf(results, 104, w) : null;
}

export function matchPoints(pick: Pick | null | undefined, res: Pick | null | undefined, id: number, results: PicksMap): number {
  if (!pick || !res) return 0;
  let p = 0;
  const pw = winner(pick);
  const rw = winner(res);
  if (pw && rw) {
    const pc = teamOf(results, id, pw);
    const rc = teamOf(results, id, rw);
    if (pc && rc && pc === rc) p += 3;
  }
  if (pick.a != null && pick.b != null && pick.a === res.a && pick.b === res.b) p += 5;
  return p;
}

export function totalsFor(picks: PicksMap, champion: string, official: Official) {
  const res = official.results;
  let total = 0;
  let exact = 0;
  Object.keys(res).forEach((idStr) => {
    const id = Number(idStr);
    const r = res[id];
    if (r == null || r.a == null || r.b == null) return;
    const pk = picks[id];
    const pts = matchPoints(pk, r, id, res);
    total += pts;
    if (pk && pk.a === r.a && pk.b === r.b) exact++;
  });
  const champ = champOf(res);
  let champOk = false;
  if (champ && champion && champion === champ) {
    total += 10;
    champOk = true;
  }
  return { total, exact, champOk };
}

export function buildStandings(
  roster: { name: string; picks: PicksMap; champion: string }[],
  me: { name: string; picks: PicksMap; champion: string },
  official: Official,
): StandingRow[] {
  const map: Record<string, { name: string; picks: PicksMap; champion: string; me: boolean }> = {};
  roster.forEach((p) => {
    map[p.name.toLowerCase()] = { name: p.name, picks: p.picks, champion: p.champion, me: false };
  });
  if (me.name) {
    map[me.name.toLowerCase()] = { name: me.name, picks: me.picks, champion: me.champion, me: true };
  }
  const rows = Object.keys(map).map((k) => {
    const t = totalsFor(map[k].picks, map[k].champion, official);
    return { name: map[k].name, total: t.total, exact: t.exact, champOk: t.champOk, me: map[k].me };
  });
  rows.sort((a, b) => b.total - a.total || b.exact - a.exact || a.name.localeCompare(b.name));
  return rows;
}

export function placeholderName(id: number, side: Side): string {
  const m = MATCHES[id];
  const feeder = side === 'a' ? m.fromA : m.fromB;
  return feeder ? 'Ganador #' + feeder : 'Por definir';
}

export function isLocked(id: number, locks: Record<number, 'open' | 'closed' | undefined>, now: number): boolean {
  const f = locks[id];
  if (f === 'closed') return true;
  if (f === 'open') return false;
  return now >= Date.parse(MATCHES[id].ko);
}

export function allMatchIds(): number[] {
  return ROUNDS.flatMap((r) => r.ids);
}
