import { ROUNDS, roundLabel, roundOf, tFlag, tName } from '../../data/tournament';
import { getMatch, placeholderName, teamOf, winner } from '../../lib/logic';
import type { Official } from '../../types';

function fmtDate(ko: string): string {
  try {
    return new Date(ko).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

interface Props {
  official: Official;
}

export default function Cuadro({ official }: Props) {
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: -0.4 }}>El cuadro</div>
        <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
          Camino a la final en el MetLife Stadium. Se va llenando con los resultados oficiales.
        </div>
      </div>
      <div style={{ overflowX: 'auto', paddingBottom: 12 }}>
        <div style={{ display: 'flex', gap: 16, minWidth: 'min-content' }}>
          {ROUNDS.map((col) => (
            <div key={col.key} style={{ minWidth: 232 }}>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.7, color: '#2A6FDB', marginBottom: 10, paddingLeft: 2 }}>
                {col.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.ids.map((id) => {
                  const ta = teamOf(official.results, id, 'a');
                  const tb = teamOf(official.results, id, 'b');
                  const r = official.results[id];
                  const w = winner(r);
                  const m = getMatch(id);
                  const nameStyle = (side: 'a' | 'b'): React.CSSProperties => ({
                    fontWeight: w === side ? 800 : 600,
                    fontSize: 13,
                    color: w ? (w === side ? '#1B1D22' : '#aab0bb') : '#5b6470',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  });
                  const scoreStyle = (side: 'a' | 'b'): React.CSSProperties => ({
                    fontWeight: 800, fontSize: 14, minWidth: 16, textAlign: 'center',
                    color: w === side ? '#2A6FDB' : '#c2c7d0',
                  });
                  const sa = r?.a != null ? r.a : '–';
                  const sb = r?.b != null ? r.b : '–';
                  let foot = roundLabel(roundOf(id)) + ' · ' + fmtDate(m.ko);
                  if (r && r.a != null && r.a === r.b && r.adv) foot += ' · pen ' + tName(teamOf(official.results, id, r.adv));
                  const aName = ta ? tName(ta) : placeholderName(id, 'a');
                  const bName = tb ? tName(tb) : placeholderName(id, 'b');
                  return (
                    <div key={id} style={{ background: '#fff', border: '1px solid #E8EAEE', borderRadius: 13, padding: '9px 11px', boxShadow: '0 1px 2px rgba(16,24,40,.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                          <span style={{ fontSize: 17 }}>{tFlag(ta)}</span>
                          <span style={nameStyle('a')}>{aName}</span>
                        </div>
                        <span style={scoreStyle('a')}>{sa}</span>
                      </div>
                      <div style={{ height: 1, background: '#F1F3F6', margin: '6px 0' }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                          <span style={{ fontSize: 17 }}>{tFlag(tb)}</span>
                          <span style={nameStyle('b')}>{bName}</span>
                        </div>
                        <span style={scoreStyle('b')}>{sb}</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#aab0bb', fontWeight: 600, marginTop: 6 }}>{foot}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
