interface Props {
  message: string;
}

export default function Toast({ message }: Props) {
  if (!message) return null;
  return (
    <div
      key={message}
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 24,
        transform: 'translateX(-50%)',
        zIndex: 60,
        background: '#1B1D22',
        color: '#fff',
        padding: '13px 20px',
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 14,
        boxShadow: '0 12px 30px rgba(0,0,0,.25)',
        animation: 'qmToast 2.6s ease both',
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  );
}
