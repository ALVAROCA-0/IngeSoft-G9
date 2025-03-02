import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterPage from './components/LoginRegisterPage';
import PantallaPrincipal from './components/PantallaPrincipal';
import MisReservas from './components/MisReservas';
import Reservar from './components/Reservar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route path="/pantalla_principal" element={<PantallaPrincipal />} />
        <Route path="/reservar" element={<Reservar />} />
        <Route path="/mis_reservas" element={<MisReservas />} />
      </Routes>
    </Router>
  );
}

export default App;
