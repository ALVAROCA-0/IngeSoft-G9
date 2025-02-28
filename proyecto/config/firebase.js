const admin = require("firebase-admin");
const dotenv = require("dotenv");

// Carga las variables de entorno
dotenv.config();

// Obtiene la ruta de la clave privada de Firebase
const serviceAccountPath = process.env.FIREBASE_ACCOUNT;

// Maneja errores si la clave privada no existe
let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error("Error al cargar la clave privada de Firebase:", error.message);
  console.error("Ruta del archivo:", serviceAccountPath);
  process.exit(1); // Detiene la ejecución si falta el archivo
}

// Inicializa Firebase con la clave privada
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
    
});

const firestore = admin.firestore();
const database = admin.database();

module.exports = { admin };  