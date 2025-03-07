const express = require('express');
const router = express.Router();
const { firestore } = require('../config/firebase');
const db = firestore;

router.get('/', async (req, res) => {
    // Parámetros de filtro opcionales
    const { type, capacity, location, name } = req.query;
    
    try {
        // Referencia a la colección de espacios
        let spacesRef = db.collection('spaces');
        let query = spacesRef;
        
        // Aplicar filtros si están presentes
        if (type) {
            query = query.where('type', '==', type);
        }
        
        if (capacity) {
            // Convertir a número y verificar que sea válido
            const capacityNum = parseInt(capacity, 10);
            console.log("Capacidad filtrada:", capacityNum); // Depuración
            
            if (!isNaN(capacityNum)) {
                // Asegúrate de que se compare como número
                query = query.where('capacity', '>=', capacityNum);
            }
        }
        
        if (location) {
            // Búsqueda por prefijo: busca ubicaciones que comiencen con el texto ingresado
            // Esto usa un rango: desde el texto hasta el texto + un caracter muy alto
            const locationEnd = location + '\uf8ff';
            query = query.where('location', '>=', location)
                         .where('location', '<=', locationEnd);
        }
        
        // Ejecutar la consulta
        const snapshot = await query.get();
        
        if (snapshot.empty) {
            // No hay espacios que coincidan con los filtros
            return res.status(204).send();
        }
        
        // Procesar los resultados
        const spaces = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            
            // Filtro adicional por nombre (si existe)
            if (name && !data.name.toLowerCase().includes(name.toLowerCase())) {
                return; // Saltar este documento
            }
            
            spaces.push({
                id: doc.id,
                name: data.name || 'Sin nombre',
                capacity: data.capacity || 0,
                description: data.description || '',
                location: data.location || 'No especificada',
                type: data.type || 'No especificado',  // Agregar el tipo
                owner_id: data.owner_id
            });
        });
        
        // Si después del filtro manual no quedan espacios
        if (spaces.length === 0) {
            return res.status(204).send();
        }
        
        // Devolver los espacios encontrados
        return res.status(200).json({
            "status": "success",
            "data": spaces
        });
        
    } catch (error) {
        console.error("Error al buscar espacios:", error);
        return res.status(500).json({
            "status": "Internal Server Error",
            "message": "No se pudo conectar con la base de datos"
        });
    }
});

// Ruta para obtener un espacio específico por ID
router.get('/:id', async (req, res) => {
    const spaceId = req.params.id;
    
    try {
        const spaceDoc = await db.collection('spaces').doc(spaceId).get();
        
        if (!spaceDoc.exists) {
            return res.status(404).json({
                "status": "Not found",
                "message": "Espacio no encontrado"
            });
        }
        
        const spaceData = spaceDoc.data();
        
        return res.status(200).json({
            "status": "success",
            "data": {
                id: spaceDoc.id,
                name: spaceData.name || 'Sin nombre',
                capacity: spaceData.capacity || 0,
                description: spaceData.description || '',
                location: spaceData.location || 'No especificada',
                type: spaceData.type || 'No especificado',  // Agregar el tipo
                owner_id: spaceData.owner_id
            }
        });
    } catch (error) {
        console.error("Error al buscar el espacio:", error);
        return res.status(500).json({
            "status": "Internal Server Error",
            "message": "No se pudo conectar con la base de datos"
        });
    }
});

// exporta el router a app.js
module.exports = router;