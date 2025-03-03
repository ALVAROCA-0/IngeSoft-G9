const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase'); 
const db = admin.firestore();

//En este archivo vienen los tres metodos para gestionar espacios.

//creacion de un nuevo espacio
router.post("/new", async (req,res) => {
    //variables de interes en el body
    const types = [
        "Sala de conferencias",
        "Sala de reuniónes",
        "Aula",
        "Auditorio"
    ];
    const { name, capacity, location, owner_id, type, description } = req.body

    //verificacion de variables obligatorias
    if (!name || !capacity || !location || !owner_id || !type) {
        res.status(400).json({ //respuesta 400
            "status":"Bad request",
            "message": "Owner_id, name, capacity or location missing"
        });
        return; // terminar función
    }
    
    if (types.includes(type)) {
        res.status(400).json({ //respuesta 400
            "status":"Bad request",
            "message": `Invalid type "${type}" not in ${types.join(", ")}`
        });
        return; // terminar función
    }

    //informacion del espacio a crear
    //datos que debe tener obligatoriamente
    var upload = {
        "owner_id":owner_id,
        "name":name,
        "capacity":capacity,
        "location":location,
        "type":type
    }

    //datos opcionales que puede tener
    if (description) upload.description = description;
    
    let failed = false; //por si ocurre un error al traer datos
    let ownerData = await db.collection("/users").doc(owner_id)
        .get()
        .then((doc) => { return doc.data(); })
        .catch((error) => { failed = true; })
    ;
    
    if (failed) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "An error ocurred when fetching owner data"
        });
        return;
    }

    if (!ownerData) { //es "undefined" si no se encuentra la informacion
        res.status(404).json({
            "status": "Not Found",
            "message": "Owner not found"
        });
        return;
    }

    if (!["admin","arrendador"].includes(ownerData.rol)) {
        res.status(403).json({
            "status": "Forbidden",
            "message": "Owner does not have admin privileges"
        });
        return;
    }

    let newSpaceID = await db.collection("/spaces")
        .add(upload)
        .then((doc)=> { return doc.id })
        .catch((error)=> { failed = true; })
    ;

    if (failed) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "An error ocurred when creating new space"
        });
        return;
    }

    res.status(201).json({
        status: "success",
        message: "Space created correctly",
        space_id: newSpaceID
    });
});

//eliminar un espacio
router.delete("/:id/remove", async (req, res) => {
    const spaceId = req.params.id;
    //variables de interes en el body
    const { owner_id } = req.body
    
    //verificacion de variables obligatorias
    if (!owner_id) {
        res.status(400).json({ //respuesta 400
            "status":"Bad request",
            "message": "Owner_id missing"
        });
        return; // terminar función
    }
    
    let failed = false;
    let spaceData = await db.collection("/spaces").doc(spaceId)
    .get()
    .then((doc) => { return doc.data() })
    .catch((error) => { failed = true; })
    ;

    if (failed) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "An error ocurred when fetching space data"
        });
        return;
    }

    if (!spaceData) {
        res.status(404).json({
            "status": "Not Found",
            "message": "Space not found"
        });
        return;
    }

    if (spaceData.owner_id !== owner_id) {
        res.status(403).json({
            "status": "Forbidden",
            "message": "The client isn't the owner of the space"
        });
        return;
    }

    let removed_space = await db.collection("/spaces")
        .doc(spaceId)
        .delete()
        .then((doc)=> { return true; })         //si hay una respuesta devolver true
        .catch((error)=> { return false; })     //si termina en error devolver false
    ;

    if (!removed_space) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "An error ocurred when removing document"
        });
        return;
    }
    
    res.status(204).send();
});

// obtener todos los espacios de un propietario
router.get("/:owner_id", async (req, res) => {
    const ownerId = req.params.owner_id;

    let failed = false;
    let spaces = await db.collection("/spaces")
        .where("owner_id", "==", ownerId)
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                return [];
            }
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        })
        .catch((error) => { failed = true; });

    if (failed) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "An error occurred when fetching spaces"
        });
        return;
    }

    res.status(200).json({
        status: "success",
        spaces: spaces
    });
});

//cambiar datos del espacio
router.patch("/:id/update", async (req, res) => {
    const spaceId = req.params.id;
    //variables de interes en el body
    const types = [
        "Sala de conferencias",
        "Sala de reuniónes",
        "Aula",
        "Auditorio"
    ];
    const { name, capacity, location, owner_id, type, description } = req.body

    if (type) {
        if (!types.includes(type)) {
            res.status(400).json({
                "status": "Bad request",
                "message": `Invalid type "${type}" not in ${types.join(", ")}`
            });
            return;
        }
        updateData.type = type;
    }

    //verificacion de variables obligatorias
    if (!owner_id) {
        res.status(400).json({
            "status": "Bad request",
            "message": "Owner_id missing"
        });
        return;
    }

    let failed = false;
    let spaceData = await db.collection("/spaces").doc(spaceId)
        .get()
        .then((doc) => { return doc.data(); })
        .catch((error) => { failed = true; });

    if (failed) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "An error occurred when fetching space data"
        });
        return;
    }

    if (!spaceData) {
        res.status(404).json({
            "status": "Not Found",
            "message": "Space not found"
        });
        return;
    }

    if (spaceData.owner_id !== owner_id) {
        res.status(403).json({
            "status": "Forbidden",
            "message": "The client isn't the owner of the space"
        });
        return;
    }

    let updateData = {};
    if (name && name !== spaceData.name) updateData.name = name;
    if (capacity && capacity !== spaceData.capacity) updateData.capacity = capacity;
    if (location && location !== spaceData.location) updateData.location = location;
    if (description && description !== spaceData.description) updateData.description = description;
    if (type && type !== spaceData.type) updateData.type = type;

    await db.collection("/spaces").doc(spaceId)
        .update(updateData)
        .catch((error) => { failed = true; });

    if (failed) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "An error occurred when updating space data"
        });
        return;
    }

    res.status(200).json({
        status: "success",
        message: "Space updated correctly"
    });
});

// exporta el router a app.js
module.exports = router;