const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

// Inicializa la aplicación
const app = express();

app.use(bodyParser.json());

app.use(express.static('public'));


app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app; // Para poder testear la app
