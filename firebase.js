import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD_r_5G1nrmv9jRlAugg8REr-6A9abHODk",
    authDomain: "sustainabite-f8e70.firebaseapp.com",
    projectId: "sustainabite-f8e70",
    storageBucket: "sustainabite-f8e70.firebasestorage.app",
    messagingSenderId: "675403340842",
    appId: "1:675403340842:web:b28b990914f4bb5adcb753",
    measurementId: "G-YCNEZ4LDP0"
};
// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);