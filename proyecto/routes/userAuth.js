const express = require('express');
const router = express.Router();
const axios = require('axios');
const { apiKey } = require('../config/firebase');

// Endpoint para inicio de sesión con email y password
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      status: "Bad request",
      message: "Email and password are required"
    });
  }
  
  try {
    // URL del endpoint REST para signInWithPassword
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    
    // Realizar la petición a Firebase Auth
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true
    });
    
    // Responder con la información del usuario autenticado y los tokens
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
