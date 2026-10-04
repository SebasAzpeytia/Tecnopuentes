import { useNavigate } from 'react-router-dom';
import GameLayout from '@/components/ui/GameLayout';

export default function CombinaDulces() {
  const navigate = useNavigate();

  return (
    <GameLayout
      onSurrender={() => navigate('/home', { replace: true })}
      backgroundColor="var(--color-peach)"
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-white)', borderRadius: '24px', padding: '32px' }}>
        <i className="fa-solid fa-candy-cane" style={{ fontSize: '64px', color: 'var(--color-peach)', marginBottom: '24px' }}></i>
        <h2 style={{ fontSize: '24px', color: 'var(--color-text)', fontFamily: 'var(--font-title)', marginBottom: '16px' }}>
          Próximamente
        </h2>
        <p style={{ color: 'var(--color-gray)', textAlign: 'center', maxWidth: '300px' }}>
          El juego de combinar dulces está en desarrollo. ¡Vuelve pronto!
        </p>
      </div>
    </GameLayout>
  );
}
