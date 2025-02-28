const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const { type, capacity } = req.query;

    //TODO: conexion con bd
    /* respuesta cuando bd no responde
    res.status(500).json(
        "status": "Internal Server Error",
        "message": "Can't connect to database"
    );
    return;
    */
    
    //TODO: filtro de espacios
    /* respuesta de espacios encontrados
    res.status(200).json({
        "status": "success",
        "data": spaces
    });
    return;
    */

    // respuesta no hay coincidencias
    //res.status(204)


    //temporalmente
    res.status(501).send();
});

// exporta el router a app.js
module.exports = router;