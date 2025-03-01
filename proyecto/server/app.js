const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();


const userAuth = require('./routes/userAuth');
const reserveSpace = require('./routes/reserveSpace');
const searchSpaces = require('./routes/searchSpaces');
const spaceAvailability = require('./routes/spaceAvailability');
const spacesAdmin = require('./routes/spacesAdmin');
const createUser = require('./routes/CreateUser');
const historyReserve = require('./routes/historyReserve');
const searchUser = require('./routes/searchUser');


const app = express();


app.use(bodyParser.json());

// Endpoints
app.use('/auth/login', userAuth);
app.use('/spaces/reservations', reserveSpace);
app.use('/spaces/search', searchSpaces);
app.use('/spaces/availability', spaceAvailability);
app.use('/spaces', spacesAdmin);
app.use('/auth/create', createUser);
app.use('/spaces/history', historyReserve);
app.use('/', searchUser);

// Servir la aplicación React (build)
app.use(express.static(path.join(__dirname, '../client/build')));

// Para cualquier otra ruta, se envía el index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app; 
