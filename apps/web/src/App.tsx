import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// TODO: importar las pantallas reales conforme se implementen.
// Cada carpeta en src/routes/{auth,residente,anfitrion,monitor}/
// ya tiene un stub por pantalla — reemplázalos con la UI real
// siguiendo los wireframes de Figma como referencia.

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/bienvenida" replace />} />
        {/* TODO: montar las rutas reales, ej: */}
        {/* <Route path="/bienvenida" element={<Bienvenida />} /> */}
        {/* <Route path="/home" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
