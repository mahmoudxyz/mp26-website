import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBTPwABBbxSdWoA43ReiylC_TTfEcA3qm4",
  authDomain: "notes-d54ee.firebaseapp.com",
  databaseURL: "https://notes-d54ee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "notes-d54ee",
  storageBucket: "notes-d54ee.firebasestorage.app",
  messagingSenderId: "899275325274",
  appId: "1:899275325274:web:5c673e6b4a6ca28b307d63",
  measurementId: "G-0ZE85EQNNQ",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
export { firebaseConfig };
