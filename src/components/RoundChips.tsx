import { ROUNDS } from '../data/tournament';

interface Props {
  round: string;
  onSetRound: (k: string) => void;
}

export default function RoundChips({ round, onSetRound }: Props) {
  return (
    <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4 }}>
      {ROUNDS.map((r) => (
        <button
          key={r.key}
          onClick={() => onSetRound(r.key)}
          style={{
            border: '1.5px solid ' + (round === r.key ? '#2A6FDB' : '#E3E5EA'),
            background: round === r.key ? '#EAF1FF' : '#fff',
            color: round === r.key ? '#2A6FDB' : '#6B7280',
            borderRadius: 999,
            padding: '8px 15px',
            fontSize: 13,
            fontWeight: 800,
            fontFamily: 'inherit',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
