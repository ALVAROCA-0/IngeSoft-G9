import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegisterPage from './components/LoginRegisterPage';
import PantallaPrincipal from './components/PantallaPrincipal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route path="/pantalla_principal" element={<PantallaPrincipal />} />
      </Routes>
    </Router>
  );
}

export default App;
