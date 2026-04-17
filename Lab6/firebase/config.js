import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD4_MIP-7jNaLgLwvBIaVwhXJwI9SGG3NE",
    authDomain: "lab6-firebase-auth-37c84.firebaseapp.com",
    projectId: "lab6-firebase-auth-37c84",
    storageBucket: "lab6-firebase-auth-37c84.firebasestorage.app",
    messagingSenderId: "72027112592",
    appId: "1:72027112592:web:4f1df054946ebdd4ed4415"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
