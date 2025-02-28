const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    // Extraer las variables del body
    const { email, password, nombre } = req.body;
  
    // Validación de los campos requeridos
    if (!email || !password || !nombre) {
      return res.status(400).json({
        status: "Bad request",
        message: "Email, password or nombre missing"
      });
    }
  
    try {
      // Crear el usuario en Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: nombre,
      });
  
      // Guardar información adicional en Firestore
      await firestore.collection('usuarios').doc(userRecord.uid).set({
        nombre,
        email
      });
  
      // Responder con éxito
      res.status(201).json({
        status: "success",
        message: "Usuario creado correctamente",
        uid: userRecord.uid
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  });
  
  // Exporta el router para usarlo en app.js
  module.exports = router;