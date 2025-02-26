const express = require('express');
const router = express.Router();
// inicio de metodo de autenticación

/* BODY ideal de la request
{
    "email": "cualquiera@gmail.com",
    "password": "abc123-"
}
*/
router.post('/', (req, res) => {
    //variables de interes en el body
    const { email, password } = req.body;
    //checkeo de las variables
    if (typeof email == "undefined" || typeof password == "undefined") {
        res.status(400).json({ //respuesta 400
            "status":"Bad request",
            "message": "Email or password missing"
        });
        return; // terminar función
    }

    // TODO: verificacion contra la base de datos

    /* Respuesta teórica equivocada
    if (!valid) {
        res.status(401).json({
            "status": "Unauthorized",
            "message": "Incorrect email or pasword"
        });
        return;
    }
    */
    // TODO: responder token, rol y tiempo de expiracion correctos
    /*
    res.status(200).json({
        "status": "success",
        "data": {
            "token": token,
            "role": role,
            "expires_in": time
        }
    });
    */

   //temporalmente
   res.status(501).send();
});

// exporta el router a app.js
module.exports = router;
