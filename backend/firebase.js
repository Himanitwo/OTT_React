// firebase.js
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json"assert { type: "json" }; // Adjust path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
