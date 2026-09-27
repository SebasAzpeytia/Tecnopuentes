import React, { ButtonHTMLAttributes, useState } from 'react';

type Variante = 'primario' | 'secundario' | 'contorno';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

export function Button({ variante = 'primario', style, onMouseEnter, onMouseLeave, ...props }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles: React.CSSProperties = {
    height: 60,
    borderRadius: 'var(--radius-button)',
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    fontSize: 18,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variante) {
      case 'primario':
        return {
          background: isHovered ? 'transparent' : 'var(--color-blue)',
          color: isHovered ? 'var(--color-blue)' : 'var(--color-white)',
          border: '2px solid var(--color-blue)',
        };
      case 'contorno':
        return {
          background: isHovered ? 'var(--color-orange)' : 'transparent',
          color: isHovered ? 'var(--color-white)' : 'var(--color-orange)',
          border: '2px solid var(--color-orange)',
        };
      case 'secundario':
        // El secundario es el naranja relleno por defecto.
        // Asumo que en hover hace lo inverso (transparente con borde naranja).
        return {
          background: isHovered ? 'transparent' : 'var(--color-orange)',
          color: isHovered ? 'var(--color-orange)' : 'var(--color-white)',
          border: '2px solid var(--color-orange)',
        };
      default:
        return {};
    }
  };

  return (
    <button
      {...props}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (onMouseEnter) onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        if (onMouseLeave) onMouseLeave(e);
      }}
      style={{
        ...baseStyles,
        ...getVariantStyles(),
        ...style,
      }}
    />
  );
}
