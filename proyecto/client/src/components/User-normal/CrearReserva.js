import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../styles/CrearReserva.css';
import DisponibilidadEspacio from './DisponibilidadEspacio';

function CrearReserva() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [espacio, setEspacio] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Obtenemos el ID del espacio de la URL
  const userData = location.state || {};
  
  // Establecer fecha actual formateada como YYYY-MM-DD al cargar
  useEffect(() => {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0];
    setFechaSeleccionada(fechaActual);
  }, []);
  
  // Cargar información del espacio
  useEffect(() => {
    const cargarEspacio = async () => {
      try {
        const response = await fetch(`/spaces/search/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (data.status === "success") {
          setEspacio(data.data);
        } else {
          throw new Error("Formato de respuesta inesperado");
        }
      } catch (err) {
        console.error('Error al cargar el espacio:', err);
        setError('No se pudo cargar la información del espacio.');
      }
    };
    
    cargarEspacio();
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combinar fecha y hora para crear timestamps ISO
    const startTime = new Date(`${fechaInicio}T${horaInicio}:00`);
    const endTime = new Date(`${fechaFin}T${horaFin}:00`);
    
    // Validar que las fechas sean correctas
    if (isNaN(startTime) || isNaN(endTime)) {
      setError('Por favor, ingresa fechas y horas válidas.');
      return;
    }
    
    // Validar que la fecha de inicio sea antes que la de fin
    if (startTime >= endTime) {
      setError('La fecha/hora de inicio debe ser anterior a la fecha/hora de fin.');
      return;
    }
    
    // Validar que no sea una fecha pasada
    const now = new Date();
    if (startTime < now) {
      setError('No puedes reservar en fechas pasadas.');
      return;
    }
    
    // Preparar datos para la API
    const reservaData = {
      space_id: id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      user_id: userData.id
    };
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/spaces/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservaData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Éxito - mostrar alerta y navegar a la pantalla principal
        alert('¡Reserva creada exitosamente!');
        navigate('/reservar', { 
          state: { 
            id: userData.id, 
            nombre: userData.nombre,
            email: userData.email,
            rol: userData.rol
          } 
        });
      } else {
        // Manejar errores específicos
        if (response.status === 409) {
          setError('Este espacio ya está reservado para ese horario.');
        } else {
          setError(data.message || 'Error al crear la reserva');
        }
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Por favor, intenta más tarde.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVolver = () => {
    navigate('/reservar', { state: userData });
  };
  
  // Función para establecer hora y fecha mínimas
  const getFechaMinima = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  const handleFechaInicioChange = (e) => {
    const nuevaFecha = e.target.value;
    setFechaInicio(nuevaFecha);
    setFechaSeleccionada(nuevaFecha);
  };

  // Función para elegir qué fecha mostrar en la disponibilidad
  const handleCambioFechaDisponibilidad = (e) => {
    setFechaSeleccionada(e.target.value);
  };
  
  return (
    <div className="crear-reserva-container">
      <h1>Reservar Espacio</h1>
      
      {espacio && (
        <div className="espacio-seleccionado">
          <h2>{espacio.name}</h2>
          <div className="espacio-info">
            <p><strong>Capacidad:</strong> {espacio.capacity} personas</p>
            <p><strong>Ubicación:</strong> {espacio.location}</p>
            <p><strong>Tipo:</strong> {espacio.type}</p>
            {espacio.description && (
              <p className="espacio-descripcion">{espacio.description}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Componente de disponibilidad colocado debajo de la info del espacio */}
      <div className="disponibilidad-wrapper">
        {fechaSeleccionada && id && (
          <DisponibilidadEspacio
            spaceId={id}
            selectedDate={fechaSeleccionada}
          />
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="formulario-reserva">
        <h3>Selecciona fecha y hora para tu reserva</h3>
        <div className="fecha-hora-grid">
          <div className="campo-fecha">
            <label htmlFor="fechaInicio">Fecha de inicio:</label>
            <input
              type="date"
              id="fechaInicio"
              value={fechaInicio}
              onChange={handleFechaInicioChange}
              min={getFechaMinima()}
              required
            />
          </div>
          
          <div className="campo-hora">
            <label htmlFor="horaInicio">Hora de inicio:</label>
            <input
              type="time"
              id="horaInicio"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
            />
          </div>
          
          <div className="campo-fecha">
            <label htmlFor="fechaFin">Fecha de fin:</label>
            <input
              type="date"
              id="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              min={fechaInicio || getFechaMinima()}
              required
            />
          </div>
          
          <div className="campo-hora">
            <label htmlFor="horaFin">Hora de fin:</label>
            <input
              type="time"
              id="horaFin"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              required
            />
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="botones-accion">
          <button
            type="button"
            className="btn-volver"
            onClick={handleVolver}
            disabled={loading}
          >
            Volver
          </button>
          
          <button
            type="submit"
            className="btn-confirmar"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearReserva;