const express = require('express');
const router = express.Router();
const { admin, firestore } = require('../config/firebase');
const db = firestore;

/* BODY ideal de la request
{
    "space_id": 129810,
    "start_time": "2025-03-15T09:00:00Z"
    "end_time": "2025-03-15T11:00:00Z"
}
*/
router.post('/', async (req, res) => {
    //variables de interes en el body
    const { space_id, start_time, end_time, user_id } = req.body

    //checkeo de las variables
    if (
        typeof space_id == "undefined" ||
        typeof start_time == "undefined" ||
        typeof end_time == "undefined"
    ) {
        res.status(400).json({ //respuesta 400
            "status":"Bad request",
            "message": "Space id, start time or end time missing"
        });
        return; // terminar función
    }

    try {
        // Check if space exists
        const spaceRef = db.collection('spaces').doc(space_id);
        const spaceSnapshot = await spaceRef.get();
        
        if (!spaceSnapshot.exists) {
            return res.status(404).json({
                "status": "Not found",
                "message": "Space not found"
            });
        }

        // Convert strings to Date objects for comparison
        const requestStartTime = new Date(start_time);
        const requestEndTime = new Date(end_time);
        
        // Validate time format and logic
        if (isNaN(requestStartTime) || isNaN(requestEndTime)) {
            return res.status(400).json({
                "status": "Bad request",
                "message": "Invalid time format"
            });
        }
        
        if (requestStartTime >= requestEndTime) {
            return res.status(400).json({
                "status": "Bad request", 
                "message": "Start time must be before end time"
            });
        }

        // Check for conflicts with existing reservations
        const reservationsRef = db.collection('reservations');
        const reservationsQuery = await reservationsRef
            .where('space_id', '==', space_id)
            .get();
        
        // Check for conflicts
        let hasConflict = false;
        reservationsQuery.forEach((doc) => {
            const reservation = doc.data();
            const existingStart = new Date(reservation.start_time);
            const existingEnd = new Date(reservation.end_time);
            
            // Check for overlap
            if (
                (requestStartTime >= existingStart && requestStartTime < existingEnd) ||
                (requestEndTime > existingStart && requestEndTime <= existingEnd) ||
                (requestStartTime <= existingStart && requestEndTime >= existingEnd)
            ) {
                hasConflict = true;
                return; // exit forEach loop
            }
        });
        
        if (hasConflict) {
            return res.status(409).json({
                "status": "Conflict",
                "message": "Space already reserved for that time"
            });
        }
        
        // Create new reservation
        const newReservation = {
            space_id: space_id,
            start_time: start_time,
            end_time: end_time,
            user_id: user_id || 'anonymous', // In case user_id not provided
            created_at: admin.firestore.FieldValue.serverTimestamp()
        };
        
        // Add new reservation to Firestore
        const newReservationRef = await db.collection('reservations').add(newReservation);
        const reservationId = newReservationRef.id;
        
        // Generate a simple PDF URL (in a real app, you would generate an actual PDF)
        const pdfUrl = `https://firebase/${reservationId}.pdf`;
        
        return res.status(201).json({
            "status": "success",
            "data": {
                "reservation_id": reservationId,
                "pdf_url": pdfUrl
            }
        });
        
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({
          "status": "Internal Server Error",
          "message": error.message || "Unexpected error occurred"
      });      
    }
});

router.get('/available-spaces', async (req, res) => {
    try {
        const spacesRef = db.collection('spaces');
        const spacesSnapshot = await spacesRef.get();
        
        if (spacesSnapshot.empty) {
            return res.status(404).json({
                "status": "Not found",
                "message": "No spaces available"
            });
        }

        const spaces = [];
        spacesSnapshot.forEach(doc => {
            spaces.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json({
            "status": "success",
            "data": spaces
        });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({
            "status": "Internal Server Error",
            "message": error.message || "Unexpected error occurred"
        });
    }
});

// Endpoint para obtener reservas existentes de un espacio
router.get('/:spaceId/availability', async (req, res) => {
    const { spaceId } = req.params;
    const { date } = req.query; // Opcionalmente filtrar por fecha
    
    try {
      // Consultar reservas para este espacio
      const reservationsRef = db.collection('reservations');
      const snapshot = await reservationsRef
        .where('space_id', '==', spaceId)
        .get();
      
      const reservations = [];
      snapshot.forEach(doc => {
        reservations.push(doc.data());
      });
      
      return res.status(200).json({
        status: "success",
        data: reservations
      });
    } catch (error) {
      return res.status(500).json({
        status: "Internal Server Error",
        message: error.message
      });
    }
  });

// exporta el router a app.js
module.exports = router;
