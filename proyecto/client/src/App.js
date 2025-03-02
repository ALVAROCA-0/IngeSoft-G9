import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterPage from './components/common/LoginRegisterPage';
import PantallaPrincipal from './components/common/PantallaPrincipal';
import MisReservas from './components/MisReservas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route path="/pantalla_principal" element={<PantallaPrincipal />} />
        <Route path="/mis_reservas" element={<MisReservas />} />
      </Routes>
    </Router>
  );
}

export default App;
