import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCookie, getUser } from '../../shared_funcs/cookies'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Nuevo hook para navegación

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {

        const response2 = await fetch('/users/'+result.localId, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          const result2 = await response2.json();
          if (response2.ok) {
        //alert(result2.name);
          }

          const userInfo = {
            nombre: result2.name,
            id: result.localId,
            email: email,
            rol: result2.rol  // Añadir esta línea (asumiendo que el rol está en result2.rol)
          };
          var currDate = new Date();
          currDate.setMinutes(currDate.getMinutes()+30);
          setCookie('user', JSON.stringify(userInfo), '/', { expires: currDate})

          navigate('/pantalla_principal');
        //alert(result.localId);
      } else {
        alert('Error al iniciar sesión: ' + result.message);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      alert('Error en la comunicación con el servidor');
    }
  };

  return (
    <form onSubmit={handleLogin}>
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
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default Login;
