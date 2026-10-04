import React from 'react';

interface GameLayoutProps {
  onSurrender?: () => void;
  timeSeconds?: number;
  score?: React.ReactNode;
  backgroundColor?: string;
  children: React.ReactNode;
}

export function formatearTiempo(segundos: number) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function GameLayout({ 
  onSurrender, 
  timeSeconds, 
  score, 
  backgroundColor = 'var(--color-bg)',
  children 
}: GameLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor, display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Info */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '16px', 
        backgroundColor: 'var(--color-white)', 
        borderBottom: '1px solid var(--color-light-gray)' 
      }}>
        {/* Espacio para mantener flexbox incluso si no hay onSurrender */}
        {onSurrender ? (
          <button 
            onClick={onSurrender}
            style={{ 
              padding: '12px 16px', 
              backgroundColor: '#ef4444', 
              color: 'var(--color-white)', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              fontSize: '14px', 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-flag"></i> Rendirse
          </button>
        ) : <div style={{ width: '100px' }} />}
        
        {timeSeconds !== undefined ? (
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text)', fontFamily: 'monospace' }}>
            {formatearTiempo(timeSeconds)}
          </div>
        ) : <div style={{ width: '50px' }} />}

        {score !== undefined ? (
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-orange-dark)', display: 'flex', gap: '4px', alignItems: 'center' }}>
            <i className="fa-solid fa-star"></i> {score}
          </div>
        ) : <div style={{ width: '60px' }} />}
      </div>

      {/* Tablero (Children) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
