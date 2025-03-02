import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterPage from './components/common/LoginRegisterPage';
import PantallaPrincipal from './components/common/PantallaPrincipal';
import MisReservas from './components/common/MisReservas';
import EspaciosDisponibles from './components/User-normal/EspaciosDisponibles';
import CrearReserva from './components/User-normal/CrearReserva';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route path="/pantalla_principal" element={<PantallaPrincipal />} />
        <Route path="/mis_reservas" element={<MisReservas />} />
        <Route path="/reservar" element={<EspaciosDisponibles />} />
        <Route path="/reservar/:id" element={<CrearReserva />} />
      </Routes>
    </Router>
  );
}

export default App;
