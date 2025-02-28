import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
      <h1>Ingesoft</h1>
      <div className="options">
        <button onClick={() => setIsLogin(true)}>Iniciar Sesión</button>
        <button onClick={() => setIsLogin(false)}>Registrarse</button>
      </div>
      {isLogin ? <Login /> : <Register />}
    </div>
  );
};

export default LoginRegisterPage;
