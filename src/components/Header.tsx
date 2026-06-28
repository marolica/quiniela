import type { Tab } from '../types';

interface Props {
  myName: string;
  tab: Tab;
  onEditName: () => void;
  onSetTab: (t: Tab) => void;
}

const NAV: [Tab, string][] = [
  ['pronos', '📝 Pronósticos'],
  ['cuadro', '🏟️ Cuadro'],
  ['ranking', '🏅 Ranking'],
  ['org', '⚙️ Organizador'],
];

export default function Header({ myName, tab, onEditName, onSetTab }: Props) {
  const initial = (myName || '?').trim().charAt(0).toUpperCase();
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(255,255,255,.88)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E8EAEE',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <div style={{ fontSize: 22 }}>⚽</div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: -0.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Quiniela Mundial <span style={{ color: '#2A6FDB' }}>2026</span>
          </div>
        </div>
        <button
          onClick={onEditName}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#F1F3F6',
            border: 'none',
            borderRadius: 999,
            padding: '7px 8px 7px 13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {myName}
          </span>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background: '#2A6FDB',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {initial}
          </span>
        </button>
      </div>
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '0 12px 10px',
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
        }}
      >
        {NAV.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onSetTab(key)}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '9px 15px',
              fontSize: 13.5,
              fontWeight: 800,
              fontFamily: 'inherit',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: tab === key ? '#1B1D22' : 'transparent',
              color: tab === key ? '#fff' : '#6B7280',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
