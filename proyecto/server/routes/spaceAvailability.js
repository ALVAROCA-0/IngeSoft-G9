const express = require('express');
const router = express.Router();

router.get("/:id", (res,req) => {
    const spaceId = req.params.id;
    
    //verificacion de variables obligatorias
    if (typeof spaceId !== "number") {
        res.status(400).json({ //respuesta 400
            "status":"Bad request",
            "message": "Space id missing"
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
    
    /* respuesta espacio no encontrado
    res.status(404).json({
        "status": "Not found",
        "message": "Space not found"
    });
    return;
    */
   
    //TODO: retornar disponibilidad
    /*
    res.status(200).json({
        "status": "Success",
        "data": availability
    });
    */

    //temporalmente
    res.status(501).send();
});

// exporta el router a app.js
module.exports = router;