import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import '../../styles/LoginRegisterPage.css';

const LoginRegisterPage = () => {
  const location = useLocation();
  // Inicializar isLogin basado en el state de navegación o false por defecto
  const [isLogin, setIsLogin] = useState(false);
  
  useEffect(() => {
    // Si hay un state que indica mostrar login, actualiza el estado
    if (location.state && location.state.showLogin) {
      setIsLogin(false);
    }
  }, [location]);

  return (
    <div className="container">
      <img src="https://res.cloudinary.com/dmwkx8wmh/image/upload/v1740778102/LogoReservaPlus_1_fg1cwo.jpg" alt="Logo" className="logo" />
      <div className="options">
        <button onClick={() => setIsLogin(false)} id="btn-inicial" className="btn btn-primary">¿Ya tienes cuenta?</button>
        <button onClick={() => setIsLogin(true)} id="btn-inicial" className="btn btn-primary">Registrarse</button>
      </div>
      {isLogin ? <Register /> : <Login />}
    </div>
  );
};

export default LoginRegisterPage;
