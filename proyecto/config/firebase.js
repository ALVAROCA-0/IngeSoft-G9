const admin = require('firebase-admin');
const serviceAccount = require('C:\Users\pauli\Downloads\ingesoft-3dc65-firebase-adminsdk-fbsvc-62e340f0a0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ingesoft-3dc65.firebaseio.com"
});

const firestore = admin.firestore();

module.exports = { admin, firestore };
