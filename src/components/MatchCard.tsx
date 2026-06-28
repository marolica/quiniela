import { roundLabel, roundOf, tFlag, tName } from '../data/tournament';
import { matchPoints, placeholderName, teamOf } from '../lib/logic';
import type { Pick, Side } from '../types';

function fmtDate(ko: string): string {
  try {
    return new Date(ko).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function inputStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 52,
    height: 46,
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 800,
    fontFamily: 'inherit',
    borderRadius: 11,
    border: '1.5px solid #E3E5EA',
    background: disabled ? '#F1F3F6' : '#fff',
    color: disabled ? '#9aa1ad' : '#1B1D22',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'text',
  };
}

function advStyle(active: boolean, disabled: boolean): React.CSSProperties {
  return {
    flex: 1,
    border: '1.5px solid ' + (active ? '#2A6FDB' : '#E3E5EA'),
    background: active ? '#2A6FDB' : '#fff',
    color: active ? '#fff' : '#5b6470',
    borderRadius: 10,
    padding: '9px 6px',
    fontWeight: 700,
    fontSize: 12,
    fontFamily: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled && !active ? 0.6 : 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

interface Props {
  id: number;
  mode: 'player' | 'org';
  value: Pick | undefined;
  resultsForBracket: import('../types').PicksMap;
  officialResult?: Pick | undefined;
  locked: boolean;
  ko: string;
  venue: string;
  onScoreChange: (side: Side, raw: string) => void;
  onAdv: (side: Side) => void;
  onToggleLock?: () => void;
}

export default function MatchCard({
  id, mode, value, resultsForBracket, officialResult, locked, ko, venue,
  onScoreChange, onAdv, onToggleLock,
}: Props) {
  const ta = teamOf(resultsForBracket, id, 'a');
  const tb = teamOf(resultsForBracket, id, 'b');
  const known = !!(ta && tb);
  const disabled = mode === 'player' ? (locked || !known) : !known;
  const sa = value?.a != null ? String(value.a) : '';
  const sb = value?.b != null ? String(value.b) : '';
  const isTie = value?.a != null && value?.b != null && value.a === value.b;
  const adv = value?.adv;
  const meta = roundLabel(roundOf(id)) + (venue ? ' · ' + venue : '') + ' · ' + fmtDate(ko);

  const aName = known ? tName(ta) : placeholderName(id, 'a');
  const bName = known ? tName(tb) : placeholderName(id, 'b');

  let lockLabel: string;
  let lockStyle: React.CSSProperties;
  if (mode === 'player') {
    lockLabel = locked ? '🔒 Cerrado' : '🟢 Abierto';
    lockStyle = {
      whiteSpace: 'nowrap', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 999,
      background: locked ? '#FBE9EA' : '#E6F6EE', color: locked ? '#C0392B' : '#15A06B',
    };
  } else {
    lockLabel = locked ? '🔒 Cerrado' : '🟢 Abierto';
    lockStyle = {
      whiteSpace: 'nowrap', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 999,
      border: '1px solid ' + (locked ? '#F0C8C5' : '#BFE7D3'),
      background: locked ? '#FBE9EA' : '#E6F6EE', color: locked ? '#C0392B' : '#15A06B',
      cursor: 'pointer', fontFamily: 'inherit',
    };
  }

  let showPoints = false;
  let resultLabel = '';
  let pointsLabel = '';
  let pointsStyle: React.CSSProperties = {};
  if (mode === 'player' && officialResult && officialResult.a != null && officialResult.b != null) {
    showPoints = true;
    resultLabel = officialResult.a + '–' + officialResult.b +
      (officialResult.a === officialResult.b && officialResult.adv ? ' (pen ' + tName(teamOf(resultsForBracket, id, officialResult.adv)) + ')' : '');
    const pts = matchPoints(value, officialResult, id, resultsForBracket);
    pointsLabel = (pts > 0 ? '+' + pts : String(pts)) + ' pts';
    pointsStyle = {
      fontSize: 12, fontWeight: 800, padding: '4px 11px', borderRadius: 999,
      background: pts > 0 ? '#E6F6EE' : '#F1F3F6', color: pts > 0 ? '#15A06B' : '#9aa1ad',
    };
  }

  const cardPad = mode === 'player' ? '14px 15px 13px' : '12px 13px';
  const cardBg = mode === 'player' ? '#fff' : '#FAFBFC';
  const cardBorder = mode === 'player' ? '#E8EAEE' : '#EDEFF2';

  return (
    <div
      style={{
        background: cardBg, border: '1px solid ' + cardBorder, borderRadius: mode === 'player' ? 18 : 14,
        padding: cardPad, boxShadow: mode === 'player' ? '0 1px 2px rgba(16,24,40,.04)' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: mode === 'player' ? 11 : 9 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280' }}>{meta}</span>
        {mode === 'org' ? (
          <button onClick={onToggleLock} style={lockStyle}>{lockLabel}</button>
        ) : (
          <span style={lockStyle}>{lockLabel}</span>
        )}
      </div>

      {known ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: mode === 'player' ? 10 : 9, marginBottom: mode === 'player' ? 8 : 7 }}>
            <span style={{ fontSize: mode === 'player' ? 26 : 22, width: mode === 'player' ? 32 : 28, textAlign: 'center' }}>{tFlag(ta)}</span>
            <span style={{ flex: 1, fontWeight: 700, fontSize: mode === 'player' ? 15 : 14 }}>{aName}</span>
            <input
              type="number" inputMode="numeric" min={0} max={20} value={sa}
              onChange={(e) => onScoreChange('a', e.target.value)}
              disabled={disabled}
              style={inputStyle(disabled)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: mode === 'player' ? 10 : 9 }}>
            <span style={{ fontSize: mode === 'player' ? 26 : 22, width: mode === 'player' ? 32 : 28, textAlign: 'center' }}>{tFlag(tb)}</span>
            <span style={{ flex: 1, fontWeight: 700, fontSize: mode === 'player' ? 15 : 14 }}>{bName}</span>
            <input
              type="number" inputMode="numeric" min={0} max={20} value={sb}
              onChange={(e) => onScoreChange('b', e.target.value)}
              disabled={disabled}
              style={inputStyle(disabled)}
            />
          </div>

          {isTie && (
            <div style={{ marginTop: mode === 'player' ? 11 : 9, paddingTop: mode === 'player' ? 11 : 9, borderTop: '1px dashed #E8EAEE' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginBottom: mode === 'player' ? 7 : 6 }}>
                {mode === 'player' ? "🥅 Empate a los 90' — ¿quién avanza en penales?" : 'Avanza en penales:'}
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={() => !disabled && onAdv('a')} disabled={disabled} style={advStyle(adv === 'a', disabled)}>
                  {tFlag(ta)} {aName}
                </button>
                <button onClick={() => !disabled && onAdv('b')} disabled={disabled} style={advStyle(adv === 'b', disabled)}>
                  {tFlag(tb)} {bName}
                </button>
              </div>
            </div>
          )}

          {showPoints && (
            <div style={{ marginTop: 11, paddingTop: 10, borderTop: '1px solid #F1F3F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
                Resultado oficial: <b style={{ color: '#1B1D22' }}>{resultLabel}</b>
              </span>
              <span style={pointsStyle}>{pointsLabel}</span>
            </div>
          )}
        </div>
      ) : mode === 'player' ? (
        <div style={{ padding: '16px 6px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, color: '#9aa1ad' }}>
            <span>{aName}</span><span style={{ fontSize: 11, color: '#c2c7d0' }}>VS</span><span>{bName}</span>
          </div>
          <div style={{ fontSize: 12, color: '#9aa1ad', marginTop: 6 }}>
            ⏳ Se desbloquea cuando el organizador cargue los resultados de la ronda anterior.
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px 4px', textAlign: 'center', fontSize: 12, color: '#9aa1ad', fontWeight: 600 }}>
          ⏳ Define antes los ganadores de la ronda previa.
        </div>
      )}
    </div>
  );
}
