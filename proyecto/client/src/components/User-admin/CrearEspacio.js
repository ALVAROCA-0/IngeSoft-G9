import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/CrearEspacio.css';
import { getUser, updateCookie } from '../../shared_funcs/cookies';

function CrearEspacio() {
    const location = useLocation();
    const userData = getUser();

    useEffect(()=> {
        if (!userData) {
            navigate("/");
            return;
        }
        if (!["admin",'arrendador'].includes(userData.rol)) {
            updateCookie('user','/',30);
            navigate('/pantalla_principal')
        }
    });

    const navigate = useNavigate();
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        const obligatory = ['name', 'capacity', 'location', 'type'];
        event.preventDefault();
        let formData = {};
        for (var [key, value] of new FormData(document.getElementById('form')).entries()) {
            if (obligatory.includes(key) && !value) {
                console.error(`The obligatory field ${key} is empty ${typeof value}`);
                return;
            } 
            formData[key] = value;
        }
        
        try {
            formData.capacity = Number(formData.capacity);
        } catch (err) {
            console.log('Capacity must be a number');
        }
        if (!window.confirm(
            `¿Esta seguro de que quiere crear el nuevo espacio ${formData.name}?`
        )) return;

        formData.owner_id = userData.id;

        const status = await fetch('/spaces/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
        })
        .then((res)=>{ return res.status; })
        .catch((e)=>{ return 500; });
        if(status ===201) {
            alert('Espacio creado exitosamente!');
            // navigate(`/mis_espacios/${res.body.space_id}`)
        } else if (status === 404) {
            setError('No se encontro el perfil de administrador, ingrese de nuevo');
            updateCookie('user','/',-1);
            navigate('/')
        } else if (status === 403) {
            setError('El usuario no tiene estatus de administrador');
            updateCookie('user','/',30);
            navigate('/pantalla_principal')
        } else {
            setError('Ocurrio un error al crear el espacio');
        }
        
    } 
    
    const handleVolver = () => {
        updateCookie('user','/',30);
        // Volver a la pantalla principal
        navigate('/pantalla_principal');
      };
    return (
        <div className='container main-body'>
            <h2>Crear Nuevo Espacio</h2>
            <button className='btn-volver' onClick={
                (e)=>{handleVolver()}
            }>Volver</button>
            <form onSubmit={handleSubmit} id='form'>
                <input 
                    name='name'
                    id='name'
                    type='string'
                    placeholder='Nombre'
                    required={true}
                    />
                <input
                    name='capacity'
                    id='capacity'
                    type='number'
                    placeholder='Capacidad (ej. 10)'
                    required={true}
                    />
                <input
                    name='location'
                    id='location'
                    type='string'
                    placeholder='Ubicación'
                    required={true}
                />
                <select name='type' id='type' required={true} defaultValue=''>
                    <option value='' disabled={true} hidden={true}> Seleccione el Tipo </option>
                    <option value='conferencia'>Sala de conferencias</option>
                    <option value='reunion'>Sala de reuniones</option>
                    <option value="aula">Aula</option>
                    <option value="auditorio">Auditorio</option>
                </select>
                <textarea 
                    name='description'
                    id='description'
                    type='text' wrap='soft'
                    placeholder='Descripción'
                    onInput={ (e) => {
                        const elem = document.getElementById("description")
                        elem.style.height = '';
                        elem.style.height = 109 + elem.scrollHeight - 125 + 'px';
                    }}
                />
                <button id='create' type='submit'>Crear!</button>
            </form>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default CrearEspacio;