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
import PersonalizarIconos from '@/routes/anfitrion/PersonalizarIconos';
import EditarIcono from '@/routes/anfitrion/EditarIcono';
import Reportes from '@/routes/anfitrion/Reportes';
import PerfilAnfitrion from '@/routes/anfitrion/PerfilAnfitrion';

export default function App() {
  const { usuarioId, rolActivo, asiloActivoId, setSesion, limpiarSesion } = useSesionStore();
  const [cargando, setCargando] = useState(true);

  // Función para obtener asilo y rol
  const cargarDatosUsuario = async (userId: string) => {
    // Obtenemos el asilo y rol ANTES de actualizar la sesión para evitar redirecciones prematuras
    const { data: miembro } = await supabase
      .from('asilo_miembros')
      .select('asilo_id, rol')
      .eq('usuario_id', userId)
      .maybeSingle();

    // Actualizamos TODO el estado de golpe
    setSesion({ 
      usuarioId: userId,
      asiloActivoId: miembro ? miembro.asilo_id : null, 
      rolActivo: miembro ? (miembro.rol as any) : null 
    });
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
              </>
            )}
            
            {/* Rutas Compartidas de Perfil (Disponibles para todos los roles) */}
            {rolActivo !== null && (
              <>
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
                <Route path="/panel/personalizar" element={<PersonalizarIconos />} />
                <Route path="/panel/personalizar/editar" element={<EditarIcono />} />
                <Route path="/panel/reportes" element={<Reportes />} />
                <Route path="/panel/perfil" element={<PerfilAnfitrion />} />
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
