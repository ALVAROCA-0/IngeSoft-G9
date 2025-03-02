import React, { useEffect } from 'react';
import '../../styles/PantallaPrincipal.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser, updateCookie } from '../../shared_funcs/cookies';

function PantallaPrincipal() {
  const location = useLocation();
  const navigate = useNavigate();
  
  var userInfo = getUser();
  useEffect(()=>{ if(!userInfo) navigate('/'); })
  const { nombre, id, email, rol } = userInfo?userInfo:{};

  const handleReservasClick = () => {
    updateCookie('user','/',30);
    navigate('/mis_reservas');
  };

  const handleReservarClick = () => {
    updateCookie('user','/',30);
    navigate('/reservar');
  };
  
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      // quitar cookie de con info de usuario
      updateCookie('user','/',-1);

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
                onClick={() => { 
                  updateCookie('user','/',30);
                  navigate('/mis_espacios');
                }}
              >
                Mis Espacios
              </button>
              <button 
                id="btn-crear-espacio" 
                className="btn btn-secondary"
                onClick={() => {
                  updateCookie('user','/',30);
                  navigate('/crear_espacio');
                }}
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