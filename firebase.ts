import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY : (import.meta as any).env?.VITE_FIREBASE_API_KEY,
  authDomain: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN : (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET : (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID : (import.meta as any).env?.VITE_FIREBASE_APP_ID,
  measurementId: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID : (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
