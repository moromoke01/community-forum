// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDIU6HP0nTn1dCVytZn-LbtDhsCrBMYg4",
  authDomain: "meal-plan-community.firebaseapp.com",
  projectId: "meal-plan-community",
  storageBucket: "meal-plan-community.appspot.com",
  messagingSenderId: "1080714286271",
  appId: "1:1080714286271:web:5a5a27677c9b8b2005e20a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore
export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
