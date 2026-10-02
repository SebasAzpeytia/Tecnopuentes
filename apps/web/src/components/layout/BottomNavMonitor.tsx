import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNavMonitor() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Panel', path: '/panel', icon: 'fa-solid fa-house' },
    { label: 'Miembros', path: '/panel/miembros', icon: 'fa-solid fa-user-group' },
    { label: 'Personalizar', path: '/panel/personalizar', icon: 'fa-solid fa-palette' },
    { label: 'Reportes', path: '/panel/reportes', icon: 'fa-solid fa-file-lines' },
    { label: 'Perfil', path: '/panel/perfil', icon: 'fa-solid fa-user' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--color-white)',
        borderTop: '1px solid var(--color-light-gray)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '12px 0 24px 0', // padding inferior extra para áreas seguras de móviles
        zIndex: 50,
      }}
    >
      {navItems.map((item) => {
        const activo = location.pathname.startsWith(item.path) && 
                      (item.path !== '/panel' || location.pathname === '/panel');

        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              gap: '4px',
              color: activo ? 'var(--color-blue)' : 'var(--color-gray)',
              minWidth: '64px',
            }}
          >
            <i className={item.icon} style={{ fontSize: '20px', marginBottom: '4px' }}></i>
            <span style={{ fontSize: '10px', fontWeight: activo ? 700 : 500 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
