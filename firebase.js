import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// import { firebase } from '@react-native-firebase/app';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB2SMhslnjSeGPiXI265b2pdQa_SDhkKUk",
    authDomain: "sustainabite-688a3.firebaseapp.com",
    projectId: "sustainabite-688a3",
    storageBucket: "sustainabite-688a3.firebasestorage.app",
    messagingSenderId: "93379659554",
    appId: "1:93379659554:web:f93641030004b4d8c4c77b",
    measurementId: "G-BDWMT9JE63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services

export const auth = getAuth(app);
export const db = getFirestore(app);


// export const storage = getStorage(app);



export default app;
