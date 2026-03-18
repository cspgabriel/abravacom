import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDunL6M6gdCiehkSd_hWK-qsHnfaadtmzA",
  authDomain: "crmh-f2ffd.firebaseapp.com",
  projectId: "crmh-f2ffd",
  storageBucket: "crmh-f2ffd.firebasestorage.app",
  messagingSenderId: "647292059443",
  appId: "1:647292059443:web:2c4a741916666ce0808846",
  measurementId: "G-HQ0JQE2Q1D"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);