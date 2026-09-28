import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Inicio', path: '/home', icon: 'fa-solid fa-house' },
    { name: 'Actividad', path: '/actividad', icon: 'fa-solid fa-chart-simple' },
    { name: 'Chat', path: '/chat', icon: 'fa-solid fa-comment' },
    { name: 'Perfil', path: '/perfil', icon: 'fa-solid fa-user' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        backgroundColor: 'var(--color-white)',
        borderTop: '1px solid var(--color-light-gray)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 'env(safe-area-inset-bottom)', // Soporte para notch de iOS
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--color-blue)' : 'var(--color-gray)',
              width: '25%',
              padding: '8px 0',
            }}
          >
            <i 
              className={tab.icon} 
              style={{ 
                fontSize: '24px',
                // Si queremos que el icono cambie de color cuando está inactivo
                opacity: isActive ? 1 : 0.7 
              }} 
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-body)',
              }}
            >
              {tab.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
