import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterPage from './components/common/LoginRegisterPage';
import PantallaPrincipal from './components/common/PantallaPrincipal';
import MisReservas from './components/MisReservas';
import EspaciosDisponibles from './components/User-normal/EspaciosDisponibles';
import CrearReserva from './components/User-normal/CrearReserva';
import CrearEspacio from './components/User-admin/CrearEspacio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route path="/pantalla_principal" element={<PantallaPrincipal />} />
        <Route path="/mis_reservas" element={<MisReservas />} />
        <Route path="/reservar" element={<EspaciosDisponibles />} />
        <Route path="/reservar/:id" element={<CrearReserva />} />
        <Route path="/crear_espacio" element={<CrearEspacio />} />
      </Routes>
    </Router>
  );
}

export default App;
