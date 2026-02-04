import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDfwyV5lR21Xbh3KS-e9TjB85rIDYAMCpU",
  authDomain: "spool-a5020.firebaseapp.com",
  projectId: "spool-a5020",
  storageBucket: "spool-a5020.firebasestorage.app",
  messagingSenderId: "1063005040926",
  appId: "1:1063005040926:web:3b81f1b1a9ec6825fb990f",
  measurementId: "G-PB6KMS9E31"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
