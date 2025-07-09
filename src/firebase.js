// src/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDa6dT-xfaCdnMPPMbTd4yI80v6JqRewU4",
  authDomain: "ott-platform-5bb8a.firebaseapp.com",
  projectId: "ott-platform-5bb8a",
  storageBucket: "ott-platform-5bb8a.appspot.com",
  messagingSenderId: "612360827492",
  appId: "1:612360827492:web:684e5a5f3d61c50f496571",
  measurementId: "G-TXNV05T74J"
};

// HMR-safe Firebase app initialization for Vite
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Prevent re-initialization
}

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, storage, analytics };
