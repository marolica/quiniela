interface Props {
  nameDraft: string;
  onNameDraft: (v: string) => void;
  onConfirm: () => void;
}

export default function Welcome({ nameDraft, onNameDraft, onConfirm }: Props) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '28px 18px',
        background: 'radial-gradient(1100px 520px at 50% -8%, #2A6FDB 0%, #1E50A8 42%, #14306A 100%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440, animation: 'qmPop .5s ease both' }}>
        <div style={{ textAlign: 'center', color: '#fff', marginBottom: 22 }}>
          <div style={{ fontSize: 52, lineHeight: 1 }}>🏆⚽</div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5, marginTop: 12 }}>
            Quiniela Mundial 2026
          </div>
          <div style={{ fontSize: 15, opacity: 0.82, marginTop: 8, lineHeight: 1.5 }}>
            Pronostica los marcadores de la fase eliminatoria — de dieciseisavos a la final — y compite con tus
            amigos.
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 22, padding: 22, boxShadow: '0 20px 50px rgba(8,22,55,.35)' }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 8,
            }}
          >
            ¿Cómo te llamas?
          </div>
          <input
            value={nameDraft}
            onChange={(e) => onNameDraft(e.target.value)}
            placeholder="Tu nombre o apodo"
            style={{
              width: '100%',
              border: '1.5px solid #E3E5EA',
              borderRadius: 13,
              padding: '15px 16px',
              fontSize: 17,
              fontFamily: 'inherit',
              fontWeight: 600,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={onConfirm}
            style={{
              width: '100%',
              marginTop: 12,
              background: '#2A6FDB',
              color: '#fff',
              border: 'none',
              borderRadius: 13,
              padding: 16,
              fontSize: 16,
              fontWeight: 800,
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            Entrar a la quiniela →
          </button>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {[
              ['📝', 'Pronostica'],
              ['📤', 'Exporta tu código'],
              ['🏅', 'Sube al ranking'],
            ].map(([icon, label]) => (
              <div
                key={label}
                style={{ flex: 1, textAlign: 'center', padding: '10px 6px', background: '#F6F7F9', borderRadius: 12 }}
              >
                <div style={{ fontSize: 20 }}>{icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', color: '#fff', opacity: 0.6, fontSize: 12, marginTop: 16 }}>
          Tus datos se guardan solo en este dispositivo.
        </div>
      </div>
    </div>
  );
}
