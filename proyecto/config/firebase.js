const admin = require('firebase-admin');
const dotenv = require('dotenv');

//carga los valores en .env a process.env
dotenv.config();

//obtiene la cuenta de firebase?
const serviceAccount = require(process.env.FIREBASE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ingesoft-3dc65.firebaseio.com"
});

const firestore = admin.firestore();

module.exports = { admin, firestore };
