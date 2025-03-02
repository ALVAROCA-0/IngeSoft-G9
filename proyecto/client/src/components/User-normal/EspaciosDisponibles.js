import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/EspaciosDisponibles.css';
import { getUser, updateCookie } from '../../shared_funcs/cookies';

function EspaciosDisponibles() {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para los filtros
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCapacidad, setFiltroCapacidad] = useState('');
  const [filtroUbicacion, setFiltroUbicacion] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const userData = getUser();

  // Función para cargar espacios con filtros
  const cargarEspacios = async (filtros = {}) => {
    setLoading(true);
    try {
      // Construir la URL con los parámetros de filtro
      const url = '/spaces/search';
      const params = new URLSearchParams();
      
      if (filtros.name) params.append('name', filtros.name);
      // Para capacidad, asegurarse de que sea un número
      if (typeof filtros.capacity == 'number') {
        params.append('capacity', filtros.capacity.toString());
      }
      if (filtros.location) params.append('location', filtros.location);
      if (filtros.type) params.append('type', filtros.type);
      
      console.log("URL con filtros:", url + '?' + params.toString()); // Depuración
      
      const urlConFiltros = params.toString() ? `${url}?${params.toString()}` : url;
      
      const response = await fetch(urlConFiltros);
      
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
    } catch (err) {
      console.error('Error al cargar espacios:', err);
      setError('No se pudieron cargar los espacios. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar espacios al inicio
  useEffect(() => {
    if (!userData) { //si no esta definida la cookie
      navigate("/");
    }
    cargarEspacios();
  }, []);

  // Función para aplicar filtros
  const aplicarFiltros = (e) => {
    e.preventDefault();
    
    // Asegúrate de que se convierte a número solo si hay un valor
    const capacidadNumerica = filtroCapacidad !== '' ? parseInt(filtroCapacidad, 10) : undefined;
    
    const filtros = {
      name: filtroNombre || undefined,
      capacity: capacidadNumerica,
      location: filtroUbicacion || undefined,
      type: filtroTipo || undefined
    };
    
    console.log("Filtros aplicados:", filtros); // Depuración
    cargarEspacios(filtros);
  };

  const limpiarFiltros = () => {
    // Resetear todos los estados de los filtros
    setFiltroNombre('');
    setFiltroCapacidad('');
    setFiltroUbicacion('');
    setFiltroTipo('');
    
    // Cargar todos los espacios sin filtros
    cargarEspacios({});
    
    // Opcional: Mostrar mensaje al usuario
    console.log('Filtros limpiados');
  };

  const handleReservar = (espacioId) => {
    // Navegar a la página de reserva con el ID del espacio
    updateCookie('user','/',30);
    navigate(`/reservar/${espacioId}`);
  };
  
  const handleVolver = () => {
    // Volver a la pantalla principal manteniendo los datos del usuario
    updateCookie('user','/',30);
    navigate('/pantalla_principal');
  };

return (
    <div className="espacios-container">
        <h1>Espacios Disponibles</h1>
        
        {/* Panel de filtros */}
        <div className="filtros-panel">
            <h3>Filtrar espacios</h3>
            <form onSubmit={aplicarFiltros}>
                <div className="filtros-grid">
                    <div className="filtro-campo">
                        <label htmlFor="filtroNombre">Nombre:</label>
                        <input
                            id="filtroNombre"
                            type="text"
                            value={filtroNombre}
                            onChange={(e) => setFiltroNombre(e.target.value)}
                            placeholder="Buscar por nombre"
                        />
                    </div>
                    
                    <div className="filtro-campo">
                        <label htmlFor="filtroCapacidad">Capacidad mínima:</label>
                        <input
                            id="filtroCapacidad"
                            type="number"
                            min="1"
                            value={filtroCapacidad}
                            onChange={(e) => setFiltroCapacidad(e.target.value)}
                            placeholder="Ej: 10"
                        />
                    </div>
                    
                    <div className="filtro-campo">
                        <label htmlFor="filtroUbicacion">Ubicación:</label>
                        <input
                            id="filtroUbicacion"
                            type="text"
                            value={filtroUbicacion}
                            onChange={(e) => setFiltroUbicacion(e.target.value)}
                            placeholder="Ej: Edificio A"
                        />
                    </div>
                    
                    <div className="filtro-campo">
                        <label htmlFor="filtroTipo">Tipo:</label>
                        <select
                            id="filtroTipo"
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="conferencia">Sala de conferencias</option>
                            <option value="reunion">Sala de reuniones</option>
                            <option value="aula">Aula</option>
                            <option value="auditorio">Auditorio</option>
                        </select>
                    </div>
                </div>
                
                <div className="filtros-botones">
                    <button type="submit" className="btn-filtrar">Aplicar filtros</button>
                    <button type="button" className="btn-limpiar" onClick={limpiarFiltros}>Limpiar filtros</button>
                </div>
            </form>
        </div>
        
        {loading ? (
            <div className="loading">Cargando espacios disponibles...</div>
        ) : error ? (
            <div className="error-message">{error}</div>
        ) : (
            <>
                {espacios.length === 0 ? (
                    <p className="no-espacios">No hay espacios disponibles con los filtros seleccionados.</p>
                ) : (
                    <div className="espacios-grid">
                        {espacios.map((espacio) => (
                            <div className="espacio-card" key={espacio.id}>
                                <h2>{espacio.name}</h2>
                                <div className="espacio-details">
                                    <p><strong>Capacidad:</strong> {espacio.capacity} personas</p>
                                    <p><strong>Ubicación:</strong> {espacio.location}</p>
                                    <p><strong>Tipo:</strong> {espacio.type}</p>
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
            </>
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