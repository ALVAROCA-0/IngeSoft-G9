import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/CrearEspacio.css';

function CrearEspacio() {
    const location = useLocation();
    const userData = location.state || {};
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        let formData = {};
        for (var [key, value] of new FormData(document.getElementById('form')).entries()) { 
            formData[key] = value;
        }
        if (formData.values().reduce((prev,curr)=>{ prev||!curr })) {
            console.log(formData.values())
            return;
        }
        if (!isNaN(formData['capacity'])) {
            return;
        }
    } 

    const handleVolver = () => {
        // Volver a la pantalla principal manteniendo los datos del usuario
        navigate('/pantalla_principal', { state: userData });
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
                        console.log(elem.scrollHeight);
                        elem.style.height = 109 + elem.scrollHeight - 125 + 'px';
                    }}
                />
                <button id='create' type='submit'>Crear!</button>
            </form>
        </div>
    );
}

export default CrearEspacio;