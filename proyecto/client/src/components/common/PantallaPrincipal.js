import React from 'react';
import '../../styles/PantallaPrincipal.css';
import { useLocation, useNavigate } from 'react-router-dom';

function PantallaPrincipal() {
  const location = useLocation();
  const navigate = useNavigate();

  const {nombre, id, email, rol} = location.state;
  //alert(nombre+id+email);

  const handleReservasClick = () => {
    navigate('/mis_reservas', {state: id});
  };

  const handleReservarClick = () => {
    navigate('/reservar');
  };

  return (
    <div className="container">
      <h1>Bienvenido {nombre}</h1>
      
      {/* Información del usuario */}
      <div className="user-info" style={{
        backgroundColor: "#f8f9fa",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
        textAlign: "left"
      }}>
        <h3>Información del usuario:</h3>
        <p><strong>Nombre:</strong> {nombre}</p>
        <p><strong>Correo:</strong> {email}</p>
        <p><strong>Rol:</strong> {rol || "Usuario"}</p>
        <p><strong>ID:</strong> {id}</p>
      </div>
      
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
