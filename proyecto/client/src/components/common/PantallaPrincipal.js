import React from 'react';
import '../../styles/PantallaPrincipal.css';
import { useLocation, useNavigate } from 'react-router-dom';

function PantallaPrincipal() {
  const location = useLocation();
  const navigate = useNavigate();
  const { nombre, id, email, rol } = location.state;

  const handleReservasClick = () => {
    navigate('/mis_reservas', { state: id });
  };

  const handleReservarClick = () => {
    navigate('/reservar', { 
      state: { 
        id, 
        nombre, 
        email, 
        rol 
      } 
    });
  };
  
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      // Navegar a la página de inicio/login
      navigate('/');
    }
  };

  return (
    <div className="container">
      <h1>Bienvenido</h1>
      <hr style={{ border: '1px solid #ced4da', margin: '10px 0 20px' }} />
      <div className="content">
        {/* Columna izquierda: Información del usuario */}
        <div className="user-info-container">
          <div className="user-info">
            <h3>Información del usuario:</h3>
            <p><strong>Nombre:</strong> <span id="nombre">{nombre}</span></p>
            <p><strong>Correo:</strong> <span id="email">{email}</span></p>
            <p><strong>Rol:</strong> <span id="rol">{rol}</span></p>
          </div>
          <div className="logout-container">
            <button id="btn-logout" className="btn btn-logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
        
        {/* Columna derecha: Botones */}
        <div className="buttons-container">
          <button 
            id="btn-reservar" 
            className="btn btn-primary"
            onClick={handleReservarClick}
          >
            Reservar
          </button>
          <button 
            id="btn-mis-reservas" 
            className="btn btn-primary"
            onClick={handleReservasClick}
          >
            Mis Reservas
          </button>
          
          {/* Botones específicos para arrendadores */}
          {rol === "arrendador" && (
            <>
              <button 
                id="btn-mis-espacios" 
                className="btn btn-primary"
                onClick={() => navigate('/mis_espacios', { state: { id, nombre, email, rol } })}
              >
                Mis Espacios
              </button>
              <button 
                id="btn-crear-espacio" 
                className="btn btn-secondary"
                onClick={() => navigate('/crear_espacio', { state: { id, nombre, email, rol } })}
              >
                Crear Espacio
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PantallaPrincipal;