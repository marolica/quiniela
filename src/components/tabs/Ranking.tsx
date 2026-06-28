import type { Me, Official, StandingRow } from '../../types';

interface Props {
  roster: Me[];
  me: Me;
  official: Official;
  standings: StandingRow[];
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Ranking({ roster, me, official, standings }: Props) {
  const offHasResults = Object.keys(official.results).some((id) => {
    const r = official.results[Number(id)];
    return r && r.a != null;
  });
  const useStandings = roster.length
    ? standings
    : official.standings && official.standings.length
      ? official.standings.map((r) => ({ ...r, me: !!(r.name && me.name && r.name.toLowerCase() === me.name.toLowerCase()) }))
      : standings;
  const hasStandings = useStandings.length > 0 && (offHasResults || (official.standings && official.standings.length > 0));

  let rankingSubtitle: string;
  if (roster.length) rankingSubtitle = 'Calculado con los pronósticos importados y los resultados oficiales.';
  else if (official.standings && official.standings.length) rankingSubtitle = 'Posiciones publicadas por el organizador.';
  else rankingSubtitle = 'Importa el código oficial del organizador para ver el ranking del grupo.';

  const noStandingsMsg = roster.length || (official.standings && official.standings.length)
    ? 'Captura algún resultado oficial para empezar a sumar puntos.'
    : 'Si eres jugador: pídele al organizador su “código oficial” y pégalo en Organizador → Importar. Si tú organizas: importa los códigos de tus amigos.';

  const podium = useStandings.slice(0, 3).map((r, i) => ({
    medal: MEDALS[i], name: r.name + (r.me ? ' (tú)' : ''), total: r.total,
    detail: r.exact + ' exactos' + (r.champOk ? ' · 🏆 campeón' : ''),
    me: r.me,
  }));
  const restRanking = useStandings.slice(3).map((r, i) => ({
    pos: i + 4, name: r.name + (r.me ? ' (tú)' : ''), total: r.total, detail: r.exact + ' exactos', me: r.me,
  }));

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: -0.4 }}>Ranking</div>
        <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>{rankingSubtitle}</div>
      </div>

      {hasStandings ? (
        <div>
          {podium.map((p) => (
            <div
              key={p.name}
              style={{
                display: 'flex', alignItems: 'center', gap: 13,
                background: p.me ? '#EAF1FF' : '#fff', border: '1px solid ' + (p.me ? '#B9D2FF' : '#E8EAEE'),
                borderRadius: 16, padding: '14px 16px', marginBottom: 10, boxShadow: '0 1px 2px rgba(16,24,40,.04)',
              }}
            >
              <div style={{ fontSize: 26, width: 34, textAlign: 'center' }}>{p.medal}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{p.detail}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#2A6FDB' }}>{p.total}</div>
                <div style={{ fontSize: 10, color: '#9aa1ad', fontWeight: 700 }}>PTS</div>
              </div>
            </div>
          ))}
          <div style={{ background: '#fff', border: '1px solid #E8EAEE', borderRadius: 16, overflow: 'hidden', marginTop: 4 }}>
            {restRanking.map((r) => (
              <div
                key={r.name}
                style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderTop: '1px solid #F1F3F6', background: r.me ? '#F5F9FF' : '#fff' }}
              >
                <span style={{ width: 26, fontWeight: 800, color: '#9aa1ad', fontSize: 14 }}>{r.pos}</span>
                <span style={{ flex: 1, fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                <span style={{ fontSize: 12, color: '#9aa1ad', marginRight: 12 }}>{r.detail}</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: '#1B1D22' }}>{r.total}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E8EAEE', borderRadius: 18, padding: '34px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 38 }}>📊</div>
          <div style={{ fontWeight: 800, fontSize: 17, marginTop: 8 }}>Aún no hay posiciones</div>
          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 6, lineHeight: 1.5, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
            {noStandingsMsg}
          </div>
        </div>
      )}
    </div>
  );
}
