import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';

// Rutas de Autenticación
import Bienvenida from '@/routes/auth/Bienvenida';
import IniciarSesion from '@/routes/auth/IniciarSesion';
import CrearCuenta from '@/routes/auth/CrearCuenta';
import UnirseAsilo from '@/routes/auth/UnirseAsilo';
import IngresarCodigo from '@/routes/auth/IngresarCodigo';

// Rutas de Residente (ejemplo inicial)
import Home from '@/routes/residente/Home';

export default function App() {
  const { usuarioId, setSesion, limpiarSesion } = useSesionStore();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 1. Revisar si hay una sesión activa al cargar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSesion({ usuarioId: session.user.id });
      } else {
        limpiarSesion();
      }
      setCargando(false);
    });

    // 2. Escuchar cambios (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSesion({ usuarioId: session.user.id });
      } else {
        limpiarSesion();
      }
    });

    return () => subscription.unsubscribe();
  }, [setSesion, limpiarSesion]);

  if (cargando) {
    // TODO: Reemplazar esto por un componente de "Splash Screen" con el logo
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-body)' }}>
        <h2>Cargando TecnoPuentes...</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={usuarioId ? "/home" : "/bienvenida"} replace />} />
        
        {/* === Rutas Públicas (Solo para usuarios NO logueados) === */}
        {!usuarioId ? (
          <>
            <Route path="/bienvenida" element={<Bienvenida />} />
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            <Route path="/crear-cuenta" element={<CrearCuenta />} />
            {/* Redirigir cualquier otra cosa a bienvenida */}
            <Route path="*" element={<Navigate to="/bienvenida" replace />} />
          </>
        ) : (
          /* === Rutas Protegidas (Solo para usuarios LOGUEADOS) === */
          <>
            {/* Flujo de Unirse a Asilo */}
            <Route path="/unirse-asilo" element={<UnirseAsilo />} />
            <Route path="/ingresar-codigo" element={<IngresarCodigo />} />
            
            {/* Dashboard / Home */}
            <Route path="/home" element={<Home />} />
            
            {/* Redirigir cualquier otra cosa a home (o unirse-asilo si luego verificamos que no tiene asilo) */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
