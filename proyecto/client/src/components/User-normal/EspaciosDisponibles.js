import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/EspaciosDisponibles.css';

function EspaciosDisponibles() {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state || {};

  useEffect(() => {
    // Función para cargar los espacios disponibles desde la BD
    const fetchEspacios = async () => {
      try {
        const response = await fetch('/spaces/search');
        
        // Si no hay espacios (204 No Content)
        if (response.status === 204) {
          setEspacios([]);
          setLoading(false);
          return;
        }
        
        // Si hay error en la solicitud
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Parsear la respuesta JSON
        const data = await response.json();
        
        if (data.status === "success" && Array.isArray(data.data)) {
          // Usar los datos reales de la base de datos
          setEspacios(data.data);
        } else {
          throw new Error("Formato de respuesta inesperado");
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar espacios:', err);
        setError('No se pudieron cargar los espacios. Intenta más tarde.');
        setLoading(false);
      }
    };

    fetchEspacios();
  }, []);

  const handleReservar = (espacioId) => {
    // Navegar a la página de reserva con el ID del espacio
    navigate(`/reservar/${espacioId}`, { 
      state: { 
        ...userData,
        espacioId 
      } 
    });
  };

  const handleVolver = () => {
    // Volver a la pantalla principal manteniendo los datos del usuario
    navigate('/pantalla_principal', { state: userData });
  };

  if (loading) return <div className="loading">Cargando espacios disponibles...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="espacios-container">
      <h1>Espacios Disponibles</h1>
      
      {espacios.length === 0 ? (
        <p className="no-espacios">No hay espacios disponibles en este momento.</p>
      ) : (
        <div className="espacios-grid">
          {espacios.map((espacio) => (
            <div className="espacio-card" key={espacio.id}>
              <h2>{espacio.name}</h2>
              <div className="espacio-details">
                <p><strong>Capacidad:</strong> {espacio.capacity} personas</p>
                <p><strong>Ubicación:</strong> {espacio.location}</p>
                <p className="espacio-descripcion">{espacio.description || 'Sin descripción'}</p>
              </div>
              <button 
                className="btn-reservar"
                onClick={() => handleReservar(espacio.id)}
              >
                Reservar
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="btn-volver"
        onClick={handleVolver}
      >
        Volver a la pantalla principal
      </button>
    </div>
  );
}

export default EspaciosDisponibles;