const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase'); // Import admin instance

/*
En este archivo vienen los tres metodos para gestionar espacios.
Probablemente se debe añadir a todos un checkeo del administrador que intenta
realizarlos. Pero no tengo idea de eso ¯\_(ツ)_/¯
*/
//creacion de un nuevo espacio
router.post("/", (req,res) => {
    //variables de interes en el body
    const { name, capacity, location, equipment, description } = req.body

    //verificacion de variables obligatorias
    if (
        typeof name == "undefined" ||
        typeof capacity == "undefined" ||
        typeof location == "undefined"
    ) {
        res.status(400).json({ //respuesta 400
            "status":"Bad request",
            "message": "Name or capacity or location missing"
        });
        return; // terminar función
    }

    var upload = {
        "name":name,
        "capacity":capacity,
        "location":location
    }
    if (equipment) upload.equipment = equipment;
    if (description) upload.description = description;
    try {
        admin.database().ref("spaces/").push().set(upload);

    } catch (error) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": `${error}`
        });
        return;
    }

    res.status(201).json({
        "status": "success",
        "message": "Space created correctly"
    });
});

//eliminar un espacio
router.delete("/:id", (req, res) => {
    const spaceId = req.params.id;

    //TODO: conexion con bd
    /* respuesta cuando bd no responde
    res.status(500).json(
        "status": "Internal Server Error",
        "message": "Can't connect to database"
    );
    return;
    */

    //TODO: checkeo espacio se puede eliminar
    /* respuesta espacio no encontrado
    res.status(404).json({
        "status": "Not found",
        "message": "Space not found"
    });
    return;
    */
   
    /* respuesta espacio no se puede eliminar porque tiene reservas
    res.status(409).json({
        "status": "Conflict",
        "message": "Space has active reservations"
    });
    return;
    */

    /* respuesta espacio eliminado
    res.status(204)
    */
   
    //temporalmente
    res.status(501).send();
});

//cambiar disponibilidad
router.patch("/availability/:id", (req, res) => {
    const spaceId = req.params.id;
    const { available } = req.body;

    // no tengo idea en base a la historia de usuario de como hacer esto :v
    
    //temporalmente
    res.status(501).send();
});

// exporta el router a app.js
module.exports = router;