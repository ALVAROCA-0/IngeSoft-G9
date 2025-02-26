const express = require('express');
const router = express.Router();
// inicio de metodo de autenticación

// Define a simple route to get user information
router.post('/', (req, res) => {
    //variables de interes en el body
    [ email, password ] = [req.body["email"], req.body["password"]];

    //checkeo de las variables
    undef_email = typeof email !== "string";
    undef_pswd = typeof password !== "string";
    if (undef_email || undef_pswd) {
        msg = "";
        if (undef_email && undef_pswd) msg = "Email and pasword missing";
        else msg = undef_email?"Email missing":"Pasword missing";
        res.status(400).json({ //respuesta 400
            "msg": msg,
            "missing": {
                "email": undef_email,
                "password": undef_pswd
            }
        });
        return; // terminar función
    }

    // TODO: verificacion contra la base de datos

    
    // TODO: responder token, rol y tiempo de expiracion correctos

    res.status(200).json({
        "status": "success",
        "data": {
            "token": 1234,
            "role": "user",
            "expires_in": 1200
        }
    });
});

// Export the router to be used in app.js
module.exports = router;
