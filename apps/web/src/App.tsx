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
import RegistrarAsilo from '@/routes/auth/RegistrarAsilo';

// Rutas de Residente
import Home from '@/routes/residente/Home';
import Actividad from '@/routes/residente/Actividad';
import Chat from '@/routes/residente/Chat';
import Perfil from '@/routes/residente/Perfil';
import MiInformacion from '@/routes/residente/perfil/MiInformacion';
import CambiarContrasena from '@/routes/residente/perfil/CambiarContrasena';
import Notificaciones from '@/routes/residente/perfil/Notificaciones';
import AyudaSoporte from '@/routes/residente/perfil/AyudaSoporte';

// Rutas de Anfitrión
import Panel from '@/routes/anfitrion/Panel';
import Miembros from '@/routes/anfitrion/Miembros';
import AgregarMiembro from '@/routes/anfitrion/AgregarMiembro';

export default function App() {
  const { usuarioId, rolActivo, asiloActivoId, setSesion, limpiarSesion } = useSesionStore();
  const [cargando, setCargando] = useState(true);

  // Función para obtener asilo y rol
  const cargarDatosUsuario = async (userId: string) => {
    setSesion({ usuarioId: userId });
    
    // Obtenemos el asilo y rol (si existe)
    const { data: miembro } = await supabase
      .from('asilo_miembros')
      .select('asilo_id, rol')
      .eq('usuario_id', userId)
      .maybeSingle();

    if (miembro) {
      setSesion({ asiloActivoId: miembro.asilo_id, rolActivo: miembro.rol as any });
    } else {
      // Si no tiene asilo asignado todavía
      setSesion({ asiloActivoId: null, rolActivo: null });
    }
  };

  useEffect(() => {
    // 1. Revisar si hay una sesión activa al cargar la app
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        await cargarDatosUsuario(session.user.id);
      } else {
        limpiarSesion();
      }
      setCargando(false);
    });

    // 2. Escuchar cambios (login, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Al iniciar sesión, cargamos sus datos de rol.
        // No mostramos pantalla de carga aquí para no parpadear, pero se actualizará el estado.
        await cargarDatosUsuario(session.user.id);
      } else {
        limpiarSesion();
      }
    });

    return () => subscription.unsubscribe();
  }, [setSesion, limpiarSesion]);

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-body)' }}>
        <h2>Cargando TecnoPuentes...</h2>
      </div>
    );
  }

  // Determinar a dónde debe ir por defecto un usuario logueado
  const getHomeRoute = () => {
    if (rolActivo === 'anfitrion' || rolActivo === 'monitor') return '/panel';
    if (rolActivo === 'residente') return '/home';
    return '/unirse-asilo'; // Si no tiene asilo ni rol
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={usuarioId ? getHomeRoute() : "/bienvenida"} replace />} />
        
        {/* === Rutas Públicas (Solo para usuarios NO logueados) === */}
        {!usuarioId ? (
          <>
            <Route path="/bienvenida" element={<Bienvenida />} />
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            <Route path="/crear-cuenta" element={<CrearCuenta />} />
            <Route path="*" element={<Navigate to="/bienvenida" replace />} />
          </>
        ) : (
          /* === Rutas Protegidas (Solo para usuarios LOGUEADOS) === */
          <>
            {/* Rutas compartidas (sin rol o en proceso de tener asilo) */}
            <Route path="/unirse-asilo" element={<UnirseAsilo />} />
            <Route path="/ingresar-codigo" element={<IngresarCodigo />} />
            <Route path="/registrar-asilo" element={<RegistrarAsilo />} />

            {/* Rutas de RESIDENTE */}
            {rolActivo === 'residente' && (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/actividad" element={<Actividad />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/perfil/informacion" element={<MiInformacion />} />
                <Route path="/perfil/contrasena" element={<CambiarContrasena />} />
                <Route path="/perfil/notificaciones" element={<Notificaciones />} />
                <Route path="/perfil/ayuda" element={<AyudaSoporte />} />
              </>
            )}
            
            {/* Rutas de ANFITRIÓN / MONITOR */}
            {(rolActivo === 'anfitrion' || rolActivo === 'monitor') && (
              <>
                <Route path="/panel" element={<Panel />} />
                <Route path="/panel/miembros" element={<Miembros />} />
                <Route path="/panel/agregar-miembro" element={<AgregarMiembro />} />
              </>
            )}
            
            {/* Guard route: cualquier URL inválida o rol incorrecto lo redirige a su home */}
            <Route path="*" element={<Navigate to={getHomeRoute()} replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
