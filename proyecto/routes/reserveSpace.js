const express = require('express');
const router = express.Router();

/* BODY ideal de la request
{
    "space_id": 129810,
    "start_time": "2025-03-15T09:00:00Z"
    "end_time": "2025-03-15T11:00:00Z"
}
*/
router.post('/', (req, res) => {
    //variables de interes en el body
    const { space_id, start_time, end_time } = req.body

    //checkeo de las variables
    if (
        typeof space_id == "undefined" ||
        typeof start_time == "undefined" ||
        typeof end_time == "undefined"
    ) {
        res.status(400).json({ //respuesta 400
            "status":"Bad request",
            "message": "Space id or start time or end time missing"
        });
        return; // terminar función
    }

    //TODO: conexion con bd
    /* respuesta cuando bd no responde
    res.status(500).json(
        "status": "Internal Server Error",
        "message": "Can't connect to database"
    );
    return;
    */

    // TODO: revision por conflicto de horarios
    /* respuesta si hay conflicto de horarios
    res.status(409).json({
        "status": "Conflict",
        "message": "Space already reserved for that time"
    });
    */

    // TODO: confirmacion reserva
    /* respuesta de reserva completada
    res.status(201).json({
        "status":success,
        "data": {
            "reservarion_id": id,
            "pdf_url": `https://firebase/${id}.pdf`
        }
    });
    */
   
    //temporalmente
    res.status(501).send();
});

// exporta el router a app.js
module.exports = router;