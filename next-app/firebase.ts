import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAjsurNMA4OxzpuZ8EfXvAmXGN-TqkT9H8",
  authDomain: "finance8-96cb0.firebaseapp.com",
  projectId: "finance8-96cb0",
  storageBucket: "finance8-96cb0.firebasestorage.app",
  messagingSenderId: "589745239376",
  appId: "1:589745239376:web:efd94d2a73e42506aa2855",
  measurementId: "G-X002F9FBGW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
