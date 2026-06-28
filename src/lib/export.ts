import { ROUNDS, roundLabel, roundOf, tName } from '../data/tournament';
import { matchPoints, teamOf } from './logic';
import type { Me, Official, StandingRow } from '../types';

export function buildCsv(roster: Me[], me: Me, official: Official, standings: StandingRow[]): string {
  const res = official.results;
  const rows: (string | number)[][] = [
    ['Jugador', 'Partido', 'Local', 'Pred. Local', 'Pred. Visita', 'Visita', 'Avanza (pred)', 'Resultado oficial', 'Puntos'],
  ];
  const pmap: Record<string, Me['picks']> = {};
  roster.forEach((p) => { pmap[p.name] = p.picks; });
  if (me.name) pmap[me.name] = me.picks;
  const allMatchIds = ROUNDS.flatMap((r) => r.ids);

  standings.forEach((pl) => {
    const picks = pmap[pl.name] || {};
    allMatchIds.forEach((id) => {
      const ta = teamOf(res, id, 'a');
      const tb = teamOf(res, id, 'b');
      if (!ta || !tb) return;
      const pk = picks[id];
      if (!pk || pk.a == null || pk.b == null) return;
      const r = res[id];
      const off = r && r.a != null
        ? `${r.a}-${r.b}${r.a === r.b && r.adv ? ' (pen ' + tName(teamOf(res, id, r.adv)) + ')' : ''}`
        : 'pendiente';
      const advName = pk.a === pk.b && pk.adv ? tName(teamOf(res, id, pk.adv)) ?? '' : '';
      const pts = r && r.a != null ? matchPoints(pk, r, id, res) : '';
      rows.push([pl.name, roundLabel(roundOf(id)), tName(ta) ?? '', pk.a, pk.b, tName(tb) ?? '', advName, off, pts]);
    });
  });

  rows.push([]);
  rows.push(['RANKING']);
  rows.push(['Pos', 'Jugador', 'Puntos', 'Marcadores exactos', 'Campeón acertado']);
  standings.forEach((pl, i) => rows.push([i + 1, pl.name, pl.total, pl.exact, pl.champOk ? 'Sí' : 'No']));

  const csv = rows
    .map((r) => r.map((c) => {
      const s = String(c == null ? '' : c);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(','))
    .join('\n');
  return '﻿' + csv;
}
