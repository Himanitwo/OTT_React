import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDa6dT-xfaCdnMPPMbTd4yI80v6JqRewU4",
  authDomain: "ott-platform-5bb8a.firebaseapp.com",
  projectId: "ott-platform-5bb8a",
  storageBucket: "ott-platform-5bb8a.firebasestorage.app",
  messagingSenderId: "612360827492",
  appId: "1:612360827492:web:684e5a5f3d61c50f496571",
  measurementId: "G-TXNV05T74J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const db = getFirestore(app);