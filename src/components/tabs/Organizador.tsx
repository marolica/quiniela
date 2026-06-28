import { ROUNDS } from '../../data/tournament';
import { getMatch, isLocked as isLockedFn } from '../../lib/logic';
import RoundChips from '../RoundChips';
import MatchCard from '../MatchCard';
import type { Me, Official, Side } from '../../types';

interface Props {
  importText: string;
  onImportText: (v: string) => void;
  onDoImport: () => void;
  roster: Me[];
  onRemovePlayer: (name: string) => void;
  official: Official;
  round: string;
  onSetRound: (k: string) => void;
  now: number;
  onScoreChange: (id: number, side: Side, raw: string) => void;
  onAdv: (id: number, side: Side) => void;
  onToggleLock: (id: number) => void;
  officialCode: string;
  onCopyOfficialCode: () => void;
  onDownloadCsv: () => void;
  onDownloadJson: () => void;
}

export default function Organizador({
  importText, onImportText, onDoImport, roster, onRemovePlayer,
  official, round, onSetRound, now, onScoreChange, onAdv, onToggleLock,
  officialCode, onCopyOfficialCode, onDownloadCsv, onDownloadJson,
}: Props) {
  const roundIds = (ROUNDS.find((r) => r.key === round) ?? ROUNDS[0]).ids;

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: -0.4 }}>Panel del organizador</div>
        <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
          Importa pronósticos, captura resultados oficiales y descarga el respaldo.
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8EAEE', borderRadius: 18, padding: 17, marginBottom: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>📥</span> Importar pronósticos
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3, lineHeight: 1.5 }}>
          Pega aquí uno o varios códigos de tus amigos (uno por línea) y dale Importar. Cada nombre se actualiza solo
          si reenvían su código.
        </div>
        <textarea
          value={importText}
          onChange={(e) => onImportText(e.target.value)}
          placeholder={'QM26.xxxxx\nQM26.yyyyy'}
          style={{
            width: '100%', marginTop: 11, height: 90, resize: 'vertical', border: '1.5px solid #E3E5EA',
            borderRadius: 12, padding: '11px 12px', fontFamily: 'ui-monospace, monospace', fontSize: 11,
            lineHeight: 1.5, outline: 'none', boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 9, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={onDoImport}
            style={{ background: '#2A6FDB', color: '#fff', border: 'none', borderRadius: 11, padding: '12px 20px', fontWeight: 800, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            Importar
          </button>
          <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>👥 {roster.length} participantes cargados</span>
        </div>
        {roster.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
            {roster.map((rc) => (
              <span
                key={rc.name}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#F1F3F6', borderRadius: 999, padding: '6px 8px 6px 12px', fontSize: 13, fontWeight: 700 }}
              >
                {rc.name}
                <button
                  onClick={() => onRemovePlayer(rc.name)}
                  style={{ border: 'none', background: '#dfe3e8', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', fontSize: 11, lineHeight: 1, color: '#6B7280' }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8EAEE', borderRadius: 18, padding: 17, marginBottom: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>✅</span> Resultados oficiales
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>
          Captura el marcador real. Al guardarlo, la siguiente ronda se llena sola.
        </div>
        <div style={{ padding: '12px 0 4px' }}>
          <RoundChips round={round} onSetRound={onSetRound} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 11, marginTop: 6 }}>
          {roundIds.map((id) => {
            const m = getMatch(id);
            return (
              <MatchCard
                key={id}
                id={id}
                mode="org"
                value={official.results[id]}
                resultsForBracket={official.results}
                locked={isLockedFn(id, official.locks, now)}
                ko={m.ko}
                venue={m.venue}
                onScoreChange={(side, raw) => onScoreChange(id, side, raw)}
                onAdv={(side) => onAdv(id, side)}
                onToggleLock={() => onToggleLock(id)}
              />
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        <div style={{ background: '#0E2A5C', color: '#fff', borderRadius: 18, padding: 17 }}>
          <div style={{ fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📣</span> Publicar a los jugadores
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 3, lineHeight: 1.5 }}>
            Comparte este código en el grupo. Al importarlo, cada quien ve sus puntos, el cuadro y el ranking
            actualizado.
          </div>
          <textarea
            readOnly
            value={officialCode}
            style={{
              width: '100%', marginTop: 11, height: 60, resize: 'none', border: 'none', borderRadius: 11,
              padding: '10px 11px', fontFamily: 'ui-monospace, monospace', fontSize: 11, background: '#0a1f44',
              color: '#9fc0ff', lineHeight: 1.45, boxSizing: 'border-box',
            }}
          />
          <button
            onClick={onCopyOfficialCode}
            style={{ width: '100%', marginTop: 10, background: '#2A6FDB', color: '#fff', border: 'none', borderRadius: 11, padding: 12, fontWeight: 800, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            Copiar código oficial
          </button>
        </div>
        <div style={{ background: '#fff', border: '1px solid #E8EAEE', borderRadius: 18, padding: 17 }}>
          <div style={{ fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💾</span> Descargar respaldo
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3, lineHeight: 1.5 }}>
            El archivo a prueba de trampas: guarda los pronósticos de todos tal como llegaron.
          </div>
          <button
            onClick={onDownloadCsv}
            style={{ width: '100%', marginTop: 11, background: '#15A06B', color: '#fff', border: 'none', borderRadius: 11, padding: 12, fontWeight: 800, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            Descargar CSV (Excel)
          </button>
          <button
            onClick={onDownloadJson}
            style={{ width: '100%', marginTop: 9, background: '#F1F3F6', color: '#1B1D22', border: 'none', borderRadius: 11, padding: 12, fontWeight: 800, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            Descargar JSON completo
          </button>
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#9aa1ad', textAlign: 'center', marginTop: 18, lineHeight: 1.5 }}>
        Reglas · 3 pts por acertar al ganador · +5 pts por marcador exacto · +10 pts por el campeón
      </div>
    </div>
  );
}
