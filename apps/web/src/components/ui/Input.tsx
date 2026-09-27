import React, { InputHTMLAttributes, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, type, style, onFocus, onBlur, ...props }, ref) => {
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const esPassword = type === 'password';
    const currentType = esPassword && mostrarContrasena ? 'text' : type;

    // Lógica para decidir el color del borde
    let borderColor = 'var(--color-light-gray)';
    if (error) {
      borderColor = 'var(--color-orange-dark)';
    } else if (isFocused) {
      borderColor = 'var(--color-blue)';
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            ref={ref}
            type={currentType}
            onFocus={(e) => {
              setIsFocused(true);
              if (onFocus) onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '16px',
              border: `2px solid ${borderColor}`,
              padding: '0 20px',
              fontSize: '16px',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text)',
              backgroundColor: 'var(--color-white)',
              boxSizing: 'border-box',
              outline: 'none', // Quitamos el outline por defecto del navegador
              transition: 'border-color 0.2s ease',
              ...(esPassword ? { paddingRight: '50px' } : {}),
              ...style,
            }}
            {...props}
          />
          
          {esPassword && (
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: 'var(--color-gray)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {mostrarContrasena ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
            </button>
          )}
        </div>
        {error && (
          <span style={{ color: 'var(--color-orange-dark)', fontSize: '12px', fontWeight: 600, paddingLeft: '8px' }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
