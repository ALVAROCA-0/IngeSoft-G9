const express = require('express');
const router = express.Router();
const { admin, database, firestore } = require('../config/firebase'); // Importa database correctamente

// Ruta para probar la conexión
router.get('/test-connection', async (req, res) => {
  try {
    // Solo probar la conexión
    const testRef = await firestore.collection('test').doc('test').set({
      test: 'test',
      timestamp: new Date().toISOString()
    });
    
    console.log("Firebase conectado correctamente");
    res.status(200).json({
      status: "success",
      message: "Conexión a Firebase establecida correctamente"
    });
  } catch (error) {
    console.error("Error específico:", error.code, error.message);
    console.error("Error completo:", error);
    res.status(500).json({
      status: "error",
      message: "Error al conectar con Firebase",
      error: {
        code: error.code || "unknown",
        message: error.message || "Error desconocido"
      }
    });
  }
});

// Ruta para probar con un ID específico
router.get('/check-specific', async (req, res) => {
  try {
    const spaceRef = await firestore.collection('spaces').doc('test123').get();
    
    if (!spaceRef.exists) {
      return res.status(404).json({
        status: "error",
        message: "El espacio con ID específico 'test123' no existe"
      });
    }
    
    res.status(200).json({
      status: "success",
      message: "Espacio encontrado",
      space: spaceRef.data()
    });
  } catch (error) {
    console.error("Error al verificar espacio específico:", error);
    res.status(500).json({
      status: "error", 
      message: "Error interno del servidor",
      error: error.message
    });
  }
});

// Ruta para listar espacios disponibles
router.get('/list-spaces', async (req, res) => {
  try {
    const spacesSnapshot = await firestore.collection('spaces').get();
    console.log("Espacios disponibles:", spacesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    if (spacesSnapshot.empty) {
      return res.status(404).json({
        status: "error",
        message: "No hay espacios disponibles en la base de datos"
      });
    }
    
    const spaces = spacesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json({
      status: "success",
      count: spaces.length,
      spaces: spaces
    });
  } catch (error) {
    console.error("Error al listar espacios:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
});

// Ruta básica para probar que el router funciona
router.get('/', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API de reservas funcionando"
  });
});

// Ruta POST para crear reservaciones - implementación mínima
router.post('/', async (req, res) => {
  try {
    // Log para depuración
    console.log("Recibida solicitud de reserva:", req.body);
    
    // Verificar que tenemos los datos mínimos necesarios
    const { space_id, start_time, end_time } = req.body;
    if (!space_id || !start_time || !end_time) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios (space_id, start_time, end_time)"
      });
    }
    
    // Intentar acceder a la colección de espacios
    const spaceRef = await firestore.collection('spaces').doc(String(space_id)).get();
    
    if (!spaceRef.exists) {
      return res.status(404).json({
        status: "error",
        message: `El espacio con ID ${space_id} no existe`
      });
    }
    
    // Si llegamos aquí, pudimos conectarnos y verificar el espacio
    res.status(200).json({
      status: "success",
      message: "Conexión exitosa y espacio verificado",
      space: spaceRef.data()
    });
    
  } catch (error) {
    console.error("Error al procesar la reserva:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
});


// Ruta para crear un espacio de prueba
router.get('/setup-test-data', async (req, res) => {
    try {
      // Crear un espacio de prueba
      await firestore.collection('spaces').doc('test123').set({
        name: "Salón de prueba",
        capacity: 10,
        location: "Edificio principal",
        available: true,
        created_at: new Date().toISOString()
      });
      
      console.log("Datos de prueba creados correctamente");
      res.status(201).json({
        status: "success",
        message: "Espacio de prueba creado correctamente",
        space: {
          id: "test123",
          name: "Salón de prueba",
          capacity: 10,
          location: "Edificio principal"
        }
      });
    } catch (error) {
      console.error("Error al crear datos de prueba:", error);
      res.status(500).json({
        status: "error",
        message: "Error al crear datos de prueba",
        error: error.message
      });
    }
  });
  
  module.exports = router;