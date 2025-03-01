import React from 'react';
import '../styles/LoginRegisterPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

function PantallaPrincipal() {
  const location = useLocation();
  const navigate = useNavigate();

  const {nombre,id,email}  = location.state;
  //alert(nombre+id+email);

  const handleReservasClick = () => {
    
    navigate('/mis_reservas',{state: id});
  };

  const handleReservarClick = () => {

    navigate('/reservar');
  };

  return (
    <div className="container">
      <h1>Bienvenido {nombre}</h1>
      <div className="options">
        <button
          id="btn-inicial"
          className="btn btn-primary"
          onClick={handleReservarClick}
        >
          Reservar
        </button>
        <button
          id="btn-inicial"
          className="btn btn-primary"
          onClick={handleReservasClick}
        >
          Mis Reservas
        </button>
      </div>
    </div>
  );
}

export default PantallaPrincipal;
