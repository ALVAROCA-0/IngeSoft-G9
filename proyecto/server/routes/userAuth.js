require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Endpoint para iniciar sesión con email y password
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      status: "Bad request",
      message: "Email and password are required"
    });
  }
  
  try {
    // Obtén la API key desde las variables de entorno
    const apiKey = process.env.FIREBASE_API_KEY;
    
    // URL del endpoint REST para autenticación con Firebase
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    
    // Realiza la petición POST a Firebase Auth
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true
    });
    
    // Devuelve la respuesta con la información del token y demás
    res.status(200).json({
      status: "success",
      message: "Usuario autenticado correctamente",
      idToken: response.data.idToken,
      refreshToken: response.data.refreshToken,
      localId: response.data.localId,
      expiresIn: response.data.expiresIn
    });
  } catch (error) {
    console.error("Error al autenticar:", error.response?.data?.error || error.message);
    res.status(401).json({
      status: "Unauthorized",
      message: error.response?.data?.error?.message || "Error al autenticar"
    });
  }
});

module.exports = router;
