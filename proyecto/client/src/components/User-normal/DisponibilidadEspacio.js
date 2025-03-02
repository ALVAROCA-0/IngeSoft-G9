import React, { useState, useEffect } from 'react';

function DisponibilidadEspacio({ spaceId, selectedDate }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!spaceId || !selectedDate) return;
    
    const fetchDisponibilidad = async () => {
      setLoading(true);
      try {
        // Añadir timestamp para asegurar que no se use una respuesta cacheada
        const response = await fetch(`/spaces/reservations/${spaceId}/availability?date=${selectedDate}&_t=${new Date().getTime()}`);
        
        if (!response.ok) {
          throw new Error('Error al obtener disponibilidad');
        }
        
        const data = await response.json();
        
        // Filtrar solo las reservas futuras (a partir de ahora)
        const now = new Date();
        const reservasFuturas = (data.data || []).filter(reserva => {
          const fechaReserva = new Date(reserva.start_time);
          return fechaReserva >= now;
        });
        
        setReservas(reservasFuturas);
      } catch (err) {
        setError('No se pudo cargar la disponibilidad');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDisponibilidad();
  }, [spaceId, selectedDate]);
  
  // Convertir reservas a intervalos ocupados para mostrar
  const horasOcupadas = reservas.map(reserva => {
    const inicio = new Date(reserva.start_time);
    const fin = new Date(reserva.end_time);
    return {
      fecha: inicio.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      horaInicio: inicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      horaFin: fin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  });
  
  return (
    <div className="disponibilidad-container">
      <h3>Disponibilidad del espacio</h3>
      
      {loading ? (
        <p>Cargando disponibilidad...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {horasOcupadas.length === 0 ? (
            <p className="disponible">¡Este espacio está completamente disponible en la fecha seleccionada!</p>
          ) : (
            <div>
              <h4>Horarios ocupados:</h4>
              <ul className="horarios-ocupados">
                {horasOcupadas.map((intervalo, index) => (
                  <li key={index}>
                    {intervalo.fecha}: <strong>{intervalo.horaInicio} - {intervalo.horaFin}</strong>
                  </li>
                ))}
              </ul>
              <p>Por favor seleccione un horario que no se solape con estos intervalos.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DisponibilidadEspacio;