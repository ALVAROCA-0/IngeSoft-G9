const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase'); // Importar admin instance


router.post('/', async (req, res) => {
    const { email, password, nombre, rol } = req.body;

    if (!email || !password || !nombre || !rol) {
        return res.status(400).json({
            status: "Bad request",
            message: "Email, password, nombre, or rol missing"
        });
    }

    try {
        // 1️⃣ Crear usuario en Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: nombre,
        });


        // 2️⃣ Guardar información en Firestore (usando el `uid` del usuario como ID del documento)
        await db.collection('/users').doc(userRecord.uid).set({
            name: nombre,
            email: email,
            rol: rol, // El rol lo tomamos del body del request
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({
            status: "success",
            message: "Usuario creado correctamente en Authentication y Firestore",
            userId: userRecord.uid,
            rol: rol
        });

    } catch (error) {
        console.error("Error en Firebase:", error); // Imprime el error en consola
        res.status(500).json({
            status: "Internal Server Error",
            message: error.toString() // Devuelve más detalles del error
        });
    }
});

// Exportar el router para usarlo en app.js
module.exports = router;
