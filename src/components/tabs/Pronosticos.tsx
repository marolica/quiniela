import { ROUNDS, TEAMS, tFlag, tName } from '../../data/tournament';
import { allMatchIds, getMatch } from '../../lib/logic';
import RoundChips from '../RoundChips';
import MatchCard from '../MatchCard';
import type { Me, Official, Side } from '../../types';

interface Props {
  me: Me;
  official: Official;
  round: string;
  onSetRound: (k: string) => void;
  isLocked: (id: number) => boolean;
  onScoreChange: (id: number, side: Side, raw: string) => void;
  onAdv: (id: number, side: Side) => void;
  onChampion: (code: string) => void;
  myCode: string;
  onCopyCode: () => void;
  onDownload: () => void;
}

export default function Pronosticos({
  me, official, round, onSetRound, isLocked, onScoreChange, onAdv, onChampion,
  myCode, onCopyCode, onDownload,
}: Props) {
  const roundIds = (ROUNDS.find((r) => r.key === round) ?? ROUNDS[0]).ids;
  const myFilledCount = allMatchIds().filter((id) => {
    const p = me.picks[id];
    return p && p.a != null && p.b != null;
  }).length;
  const championOptions = Object.keys(TEAMS)
    .map((c) => ({ code: c, label: tFlag(c) + ' ' + tName(c) }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: -0.4 }}>Tus pronósticos</div>
          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
            Marcador a los 90'. Si empatan, elige quién avanza en penales.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>Llevas pronosticados</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#2A6FDB' }}>{myFilledCount} partidos</div>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(120deg, #FFF7E0 0%, #FFFBF0 100%)',
          border: '1px solid #F3E2A8', borderRadius: 18, padding: '16px 18px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: 30 }}>🏆</div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Tu campeón del Mundial</div>
          <div style={{ fontSize: 13, color: '#957a2a', marginTop: 1 }}>
            Bonus de <b>+10 pts</b> si aciertas quién levanta la copa.
          </div>
        </div>
        <select
          value={me.champion}
          onChange={(e) => onChampion(e.target.value)}
          style={{
            border: '1.5px solid #E7D693', background: '#fff', borderRadius: 12, padding: '12px 14px',
            fontSize: 15, fontWeight: 700, fontFamily: 'inherit', minWidth: 190, cursor: 'pointer', color: '#1B1D22',
          }}
        >
          <option value="">— Elige equipo —</option>
          {championOptions.map((opt) => (
            <option key={opt.code} value={opt.code}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <RoundChips round={round} onSetRound={onSetRound} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 13 }}>
        {roundIds.map((id) => {
          const m = getMatch(id);
          return (
            <MatchCard
              key={id}
              id={id}
              mode="player"
              value={me.picks[id]}
              resultsForBracket={official.results}
              officialResult={official.results[id]}
              locked={isLocked(id)}
              ko={m.ko}
              venue={m.venue}
              onScoreChange={(side, raw) => onScoreChange(id, side, raw)}
              onAdv={(side) => onAdv(id, side)}
            />
          );
        })}
      </div>

      <div style={{ marginTop: 20, background: '#0E2A5C', color: '#fff', borderRadius: 18, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>📤</span>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Enviar mis pronósticos al organizador</div>
        </div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4, lineHeight: 1.5 }}>
          Copia tu código (o descarga el archivo) y mándaselo a quien organiza la quiniela. Cada vez que cambies algo,
          vuelve a enviarlo.
        </div>
        <textarea
          readOnly
          value={myCode}
          style={{
            width: '100%', marginTop: 12, height: 64, resize: 'none', border: 'none', borderRadius: 11,
            padding: '11px 12px', fontFamily: 'ui-monospace, monospace', fontSize: 11, background: '#0a1f44',
            color: '#9fc0ff', lineHeight: 1.45, boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 9, marginTop: 11, flexWrap: 'wrap' }}>
          <button
            onClick={onCopyCode}
            style={{ flex: 1, minWidth: 140, background: '#2A6FDB', color: '#fff', border: 'none', borderRadius: 11, padding: 13, fontWeight: 800, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            Copiar código
          </button>
          <button
            onClick={onDownload}
            style={{ flex: 1, minWidth: 140, background: 'rgba(255,255,255,.12)', color: '#fff', border: 'none', borderRadius: 11, padding: 13, fontWeight: 800, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            Descargar archivo
          </button>
        </div>
      </div>
    </div>
  );
}
