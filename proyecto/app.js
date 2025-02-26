const express = require('express');
const bodyParser = require('body-parser');
const userAuth = require('./routes/userAuth');
const dotenv = require('dotenv');

//carga los valores en .env a process.env
dotenv.config();

//inicializa la aplicación
const app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

//respuestas 
app.use('/auth/login', userAuth);

//port especificado en el .env
const PORT = process.env.PORT;

//inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app; //para poder testear la app
