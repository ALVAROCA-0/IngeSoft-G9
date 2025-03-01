// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase'); 
const db = admin.firestore();


router.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const docRef = db.collection('users').doc(userId);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }
    
    const data = docSnap.data();
    res.json(data);
  } catch (error) {
    console.error('Error al obtener el documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
