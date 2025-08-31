import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrupAKp2MikmLpfQl2LZKhsh63OrdwpE4",
  authDomain: "studiosync-e59aa.firebaseapp.com",
  projectId: "studiosync-e59aa",
  storageBucket: "studiosync-e59aa.firebasestorage.app",
  messagingSenderId: "834257764754",
  appId: "1:834257764754:web:979ebfded8e3633b99814b",
  measurementId: "G-TPBV1K7GK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Set custom auth domain to allow localhost
auth.useDeviceLanguage();

export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;