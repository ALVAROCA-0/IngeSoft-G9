const express = require('express');
const router = express.Router();
const { admin,firestore } = require('../config/firebase');
const database = admin.database();

/* 
Ejemplo de Request: 
GET /spaces/history?user_id=35&date_from=2024-01-01&date_to=2024-12-31
*/
const dba = firestore
const reservationsRef = dba.collection('reservations');

router.get('/', async (req, res) => {
    const { user_id, date_from, date_to } = req.query;

    // Validar que user_id esté presente
    if (!user_id) {
        return res.status(400).json({
            "status": "Bad request",
            "message": "user_id is required"
        });
    }

    try {
        // Obtener todas las reservas del usuario
        const snapshot = await reservationsRef.where("user_id", "==", user_id).get()
        
        if (snapshot == null   ||  snapshot.empty ) {
            return res.status(204).json({ "status": "No Content", "message": "No reservations found" });
        }

        // Filtrar por rango de fechas
        const reservations = [];
        const startDate = date_from ? new Date(date_from) : null;
        const endDate = date_to ? new Date(date_to) : null;

        snapshot.forEach((reservationSnap) => {
            const reservation = reservationSnap.data();
            const reservationDate = new Date(reservation.start_time); // Convertir a objeto Date

            // Si hay rango de fechas, filtramos las reservas
            if (
                (!startDate || reservationDate >= startDate) &&
                (!endDate || reservationDate <= endDate)
            ) {
                reservations.push({
                    reservation_id: reservationSnap.key,
                    space_id: reservation.space_id,
                    start_time: reservation.start_time,
                    end_time: reservation.end_time,
                    status: "confirmed"
                });
            }
        });

        if (reservations.length === 0) {
            return res.status(204).json({ "status": "No Content", "message": "No reservations in this date range" });
        }

        return res.status(200).json({
            "status": "success",
            "data": reservations
        });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({
            "status": "Internal Server Error",
            "message": error.message || "Unexpected error occurred"
        });
    }
});

// Exportar router
module.exports = router;
