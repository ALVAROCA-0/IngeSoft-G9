import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import '../styles/LoginRegisterPage.css';

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
        <img src="https://res.cloudinary.com/dmwkx8wmh/image/upload/v1740778102/LogoReservaPlus_1_fg1cwo.jpg" alt="Logo" class="logo" />
      <div className="options">
        <button onClick={() => setIsLogin(false)} button id="btn-inicial" className="btn btn-primary" >Ya tienes cuenta?</button>
        <button onClick={() => setIsLogin(true)} button id="btn-inicial" className="btn btn-primary">Registrarse</button>

      </div>
      {isLogin ?   <Register />:<Login />}
    </div>
  );
};

export default LoginRegisterPage;
