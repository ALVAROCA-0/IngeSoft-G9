import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../src/styles/MisReservas.css'; // Importamos el CSS
import { getUser, updateCookie } from '../../shared_funcs/cookies';

function MisReservas() {
    const location = useLocation();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState(null);
    const [spacesInfo, setSpacesInfo] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    
    const userInfo = getUser();
    const id = userInfo? userInfo.id:undefined;

    // Formatear fechas para visualización
    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Función para cargar las reservas
    const loadReservations = () => {
        setLoading(true);
        fetch('/spaces/history?user_id='+id, {
            method: 'GET',
        })
        .then((response) => {
            if (response.status === 204) {
                // 204 => No hay contenido
                setReservations([]);
                setLoading(false);
                return null; // Retornamos null para no seguir a data parsing
            }
            return response.json();
        })
        .then((data) => {
            if (data && data.data) {
                setReservations(data.data);
                
                // Obtener información detallada de cada espacio
                const spaceIds = [...new Set(data.data.map(r => r.space_id))];
                const promises = spaceIds.map(spaceId => 
                    fetch(`/spaces/search/${spaceId}`)
                    .then(res => res.json())
                    .then(spaceData => {
                        if (spaceData.status === "success") {
                            return { id: spaceId, info: spaceData.data };
                        }
                        return { id: spaceId, info: null };
                    })
                    .catch(err => {
                        console.error(`Error obteniendo info del espacio ${spaceId}:`, err);
                        return { id: spaceId, info: null };
                    })
                );
                
                Promise.all(promises)
                    .then(spacesData => {
                        const spacesMap = {};
                        spacesData.forEach(space => {
                            spacesMap[space.id] = space.info;
                        });
                        setSpacesInfo(spacesMap);
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!id) { //si expiro la cookie de "user"
            navigate("/");
            return;
        }
        // Llamada GET con query params al montar el componente
        loadReservations();
    }, []); 

    const handleGoBack = () => {
        updateCookie('user','/',30);
        navigate(-1); // Regresa a la página anterior
    };

    // Función para manejar la cancelación de una reserva
    const handleCancelReservation = (reservationId) => {
        // Confirmar antes de cancelar
        if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            setLoading(true);
            
            fetch(`/spaces/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Si la cancelación fue exitosa
                    alert('Reserva cancelada correctamente');
                    // Recargar las reservas para actualizar la lista
                    loadReservations();
                } else {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Error al cancelar la reserva');
                    });
                }
            })
            .catch(err => {
                setLoading(false);
                setError(`Error al cancelar la reserva: ${err.message}`);
                console.error('Error cancelando reserva:', err);
            });
        }
    };

    return (
        <div className="mis-reservas-container">
            <h2>Mis Reservas</h2>
            <hr className="mis-reservas-divider" />

            {/* Muestra errores de la petición */}
            {error && (
                <div className="mis-reservas-error">
                    Error: {error}
                </div>
            )}

            {/* Indicador de carga */}
            {loading && <div className="loading-indicator">Cargando reservas...</div>}

            {/* Caso de no tener aún ninguna petición o si no hay reservas (array vacío) */}
            {!loading && reservations && reservations.length === 0 && (
                <p className="empty-message">
                    No hay reservas.
                </p>
            )}

            {/* Si hay reservas, las mostramos como tarjetas */}
            {!loading && reservations && reservations.length > 0 && (
                <div className="reservas-cards">
                    {reservations.map((reservation, index) => {
                        const spaceInfo = spacesInfo[reservation.space_id];
                        
                        return (
                            <div className="reserva-card" key={index}>
                                <div className="reserva-fecha">
                                    <p><strong>Desde:</strong> {formatDate(reservation.start_time)}</p>
                                    <p><strong>Hasta:</strong> {formatDate(reservation.end_time)}</p>
                                </div>
                                <div className="reserva-estado">
                                    <span className={`estado-badge ${reservation.status}`}>
                                        {reservation.status}
                                    </span>
                                </div>
                                <div className="espacio-info">
                                    {spaceInfo ? (
                                        <>
                                            <h3>{spaceInfo.name}</h3>
                                            <p><strong>Capacidad:</strong> {spaceInfo.capacity} personas</p>
                                            <p><strong>Ubicación:</strong> {spaceInfo.location}</p>
                                            <p className="espacio-descripcion">
                                                {spaceInfo.description || 'Sin descripción disponible'}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="espacio-no-info">
                                            Información del espacio no disponible (ID: {reservation.space_id})
                                        </p>
                                    )}
                                </div>
                                
                                {/* Solo mostrar el botón de cancelar si la reserva está activa */}
                                <div className="reserva-acciones">
                                    {reservation.status === 'active' && (
                                        <button 
                                            className="btn-cancelar" 
                                            onClick={() => handleCancelReservation(reservation.reservation_id)}
                                        >
                                            Cancelar Reserva
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Botón para volver */}
            <div className="actions-container">
                <button className="btn-volver" onClick={handleGoBack}>
                    Volver
                </button>
            </div>
        </div>
    );
}

export default MisReservas;