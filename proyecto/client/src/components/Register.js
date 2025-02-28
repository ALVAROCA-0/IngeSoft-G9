import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = { nombre, email, password, rol };

    try {
      const response = await fetch('/auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        alert('Usuario registrado exitosamente: ' + result.userId);
        navigate('/pantalla_principal');
      } else {
        alert('Error al registrarse: ' + result.message);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      alert('Error en la comunicación con el servidor');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div>
        <label>Nombre:</label>
        <input 
          type="text" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)}
          required 
        />
      </div>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          required 
        />
      </div>
      <div>
        <label>Contraseña:</label>
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          required 
        />
      </div>
      <div>
        <label>Rol:</label>
        <select value={rol} onChange={e => setRol(e.target.value)} required>
          <option value="">Seleccione un rol</option>
          <option value="normal">Usuario Normal</option>
          <option value="arrendador">Usuario Arrendador</option>
        </select>
      </div>
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;
