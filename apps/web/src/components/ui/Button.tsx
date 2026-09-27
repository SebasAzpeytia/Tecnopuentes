import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario' | 'contorno';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

// Botón base grande, pensado primero para el modo Residente (56-64px).
// Los paneles de Anfitrión/Monitor pueden usar una prop de tamaño
// reducido más adelante si se necesita algo más compacto.
const estilosPorVariante: Record<Variante, React.CSSProperties> = {
  primario: { background: 'var(--color-blue)', color: 'var(--color-white)' },
  secundario: { background: 'var(--color-orange)', color: 'var(--color-white)' },
  contorno: {
    background: 'transparent',
    color: 'var(--color-orange-dark)',
    border: '2px solid var(--color-orange)',
  },
};

export function Button({ variante = 'primario', style, ...props }: Props) {
  return (
    <button
      {...props}
      style={{
        height: 60,
        borderRadius: 'var(--radius-button)',
        border: 'none',
        fontFamily: 'var(--font-title)',
        fontWeight: 700,
        fontSize: 18,
        cursor: 'pointer',
        ...estilosPorVariante[variante],
        ...style,
      }}
    />
  );
}
