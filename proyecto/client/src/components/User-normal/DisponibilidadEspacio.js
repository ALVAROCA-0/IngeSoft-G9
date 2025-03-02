import React, { useState, useEffect } from 'react';

function DisponibilidadEspacio({ spaceId, selectedDate, horaIntentada }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conflictos, setConflictos] = useState([]);
  const [conflictosDetallados, setConflictosDetallados] = useState([]);
  
  // Primer efecto para cargar las reservas existentes
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
        
        // Verificar conflictos si hay un horario intentado
        if (horaIntentada && horaIntentada.start && horaIntentada.end) {
          const conflictosEncontrados = reservasFuturas.filter(reserva => {
            const reservaInicio = new Date(reserva.start_time);
            const reservaFin = new Date(reserva.end_time);
            
            // Detectar solapamiento entre el horario intentado y la reserva
            return (
              (horaIntentada.start >= reservaInicio && horaIntentada.start < reservaFin) || // Inicio dentro de reserva existente
              (horaIntentada.end > reservaInicio && horaIntentada.end <= reservaFin) ||     // Fin dentro de reserva existente
              (horaIntentada.start <= reservaInicio && horaIntentada.end >= reservaFin)     // Reserva existente contenida en el horario
            );
          });
          
          setConflictos(conflictosEncontrados);
        } else {
          setConflictos([]);
        }
      } catch (err) {
        setError('No se pudo cargar la disponibilidad');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDisponibilidad();
  }, [spaceId, selectedDate, horaIntentada]);
  
  // Segundo efecto para determinar el tipo de conflicto para cada reserva
  useEffect(() => {
    if (!horaIntentada || conflictos.length === 0) {
      setConflictosDetallados([]);
      return;
    }
    
    const conflictosConDetalles = conflictos.map(reserva => {
      const reservaInicio = new Date(reserva.start_time);
      const reservaFin = new Date(reserva.end_time);
      const { start, end } = horaIntentada;
      
      // Determinar el tipo de conflicto
      let tipoConflicto = '';
      if (start >= reservaInicio && end <= reservaFin) {
        tipoConflicto = 'Tu reserva está completamente dentro de una reserva existente';
      } else if (start <= reservaInicio && end >= reservaFin) {
        tipoConflicto = 'Tu reserva cubre completamente una reserva existente';
      } else if (start >= reservaInicio && start < reservaFin) {
        tipoConflicto = 'El inicio de tu reserva se solapa con una reserva existente';
      } else if (end > reservaInicio && end <= reservaFin) {
        tipoConflicto = 'El final de tu reserva se solapa con una reserva existente';
      }
      
      // Calcular duración del conflicto
      const inicioConflicto = new Date(Math.max(start.getTime(), reservaInicio.getTime()));
      const finConflicto = new Date(Math.min(end.getTime(), reservaFin.getTime()));
      const duracionConflictoMs = finConflicto - inicioConflicto;
      const duracionMinutos = Math.floor(duracionConflictoMs / (1000 * 60));
      const duracionHoras = Math.floor(duracionMinutos / 60);
      const minutosRestantes = duracionMinutos % 60;
      
      const duracionFormateada = duracionHoras > 0 
        ? `${duracionHoras} hora${duracionHoras !== 1 ? 's' : ''} y ${minutosRestantes} minuto${minutosRestantes !== 1 ? 's' : ''}` 
        : `${duracionMinutos} minuto${duracionMinutos !== 1 ? 's' : ''}`;
      
      return {
        ...reserva,
        inicio: reservaInicio,
        fin: reservaFin,
        fechaFormateada: reservaInicio.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        horaInicioFormateada: reservaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        horaFinFormateada: reservaFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        tipoConflicto,
        duracionConflicto: duracionFormateada,
        tuReservaInicio: horaIntentada.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        tuReservaFin: horaIntentada.end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
    });
    
    setConflictosDetallados(conflictosConDetalles);
  }, [conflictos, horaIntentada]);
  
  return (
    <div className="disponibilidad-container">
      <h3>Disponibilidad del espacio</h3>
      
      {loading ? (
        <p>Cargando disponibilidad...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {!horaIntentada ? (
            <p>Selecciona un horario para ver la disponibilidad</p>
          ) : conflictosDetallados.length === 0 ? (
            <p className="disponible">¡El horario seleccionado está disponible!</p>
          ) : (
            <div>
              <h4>Tu reserva tiene conflicto con {conflictosDetallados.length} {conflictosDetallados.length === 1 ? 'horario ocupado' : 'horarios ocupados'}:</h4>
              
              <div className="tu-reserva-info">
                <p><strong>Tu reserva:</strong> {horaIntentada.start.toLocaleDateString('es-ES')} de {horaIntentada.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} a {horaIntentada.end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              
              <ul className="horarios-ocupados">
                {conflictosDetallados.map((conflicto, index) => (
                  <li key={index} className="conflicto-detallado">
                    <h5>Conflicto {index + 1}</h5>
                    <div className="detalles-conflicto">
                      <p><strong>Fecha:</strong> {conflicto.fechaFormateada}</p>
                      <p><strong>Horario ocupado:</strong> {conflicto.horaInicioFormateada} - {conflicto.horaFinFormateada}</p>
                      <p><strong>Tipo de conflicto:</strong> {conflicto.tipoConflicto}</p>
                      <p><strong>Duración del conflicto:</strong> {conflicto.duracionConflicto}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p>Por favor selecciona un horario que no se solape con estos intervalos.</p>
            </div>
          )}
          
          {reservas.length > 0 && (
            <div className="info-total-reservas">
              <p><small>Total de reservas en esta fecha: {reservas.length}</small></p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DisponibilidadEspacio;