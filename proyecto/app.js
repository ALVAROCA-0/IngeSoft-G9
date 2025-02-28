const express = require('express');
const bodyParser = require('body-parser');
const userAuth = require('./routes/userAuth');
const reserveSpace = require('./routes/reserveSpace');
const searchSpaces = require('./routes/searchSpaces');
const spaceAvailability = require('./routes/spaceAvailability');
const spacesAdmin = require('./routes/spacesAdmin');
const admin = require('firebase-admin');
const createUser = require('./routes/CreateUser');
const dotenv = require('dotenv');

//carga los valores en .env a process.env
dotenv.config();

//inicializa la aplicación
const app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

//respuestas 
app.use('/auth/login', userAuth);
app.use('/spaces/reservations', reserveSpace);
app.use('/spaces/search', searchSpaces);
app.use('/spaces/availability', spaceAvailability);
app.use('/spaces', spacesAdmin);
app.use('/auth/create', createUser);

//port especificado en el .env
//const PORT = process.env.PORT;

const PORT = 3000;

//inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app; //para poder testear la app