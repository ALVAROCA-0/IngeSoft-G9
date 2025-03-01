import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


function MisReservas() {
    const location = useLocation();
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState('');
  
  const id = location.state;

  useEffect(() => {
    // Llamada GET con query params al montar el componente
    fetch('/spaces/history?user_id='+id, {
      method: 'GET',
    })
      .then((response) => {
        if (response.status === 204) {
          // 204 => No hay contenido
          setReservations([]);
          return null; // Retornamos null para no seguir a data parsing
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.data) {
          setReservations(data.data);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []); 
  // El array vacío [] indica que se ejecuta sólo al montar el componente

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Mis Reservas</h2>

      {/* Muestra errores de la petición */}
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}

      {/* Caso de no tener aún ninguna petición o si no hay reservas (array vacío) */}
      {reservations && reservations.length === 0 && (
        <p style={{ marginTop: '20px', fontStyle: 'italic' }}>
          No hay reservas.
        </p>
      )}

      {/* Si hay reservas, las listamos en un "cuadro" (por ejemplo, una tabla) */}
      {reservations && reservations.length > 0 && (
        <table
          style={{
            marginTop: '20px',
            width: '100%',
            borderCollapse: 'collapse'
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                Space ID
              </th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                Inicio
              </th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                Fin
              </th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {reservation.space_id}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {reservation.start_time}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {reservation.end_time}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {reservation.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MisReservas;
