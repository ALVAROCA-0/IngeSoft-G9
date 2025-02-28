// main.js

document.addEventListener('DOMContentLoaded', () => {
    const btnRegister = document.getElementById('btn-register');
    const btnLogin = document.getElementById('btn-login');
    const registerFormContainer = document.getElementById('register-form');
    const loginFormContainer = document.getElementById('login-form');
    const formRegister = document.getElementById('form-register');
  
    // Mostrar formulario de registro
    btnRegister.addEventListener('click', () => {
      registerFormContainer.classList.remove('hidden');
      loginFormContainer.classList.add('hidden');
    });
  
    // Mostrar formulario de inicio de sesión
    btnLogin.addEventListener('click', () => {
      loginFormContainer.classList.remove('hidden');
      registerFormContainer.classList.add('hidden');
    });
  
    // Manejar el envío del formulario de registro
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Obtener datos del formulario
      const nombre = document.getElementById('nombre').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const rol = document.getElementById('rol').value;
  
      const data = { nombre, email, password, rol };
  
      try {
        const response = await fetch('/auth/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (response.ok) {
          alert('Usuario registrado exitosamente: ' + result.userId);
          formRegister.reset();
        } else {
          alert('Error al registrar usuario: ' + result.message);
        }
      } catch (error) {
        console.error('Error en la petición:', error);
        alert('Error en la comunicación con el servidor');
      }
    });
  });
  