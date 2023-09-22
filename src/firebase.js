// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMn3b3HuLPaiZU7rh0r4x5uEVQhHBOmwI",
  authDomain: "manahseva-6b5e1.firebaseapp.com",
  projectId: "manahseva-6b5e1",
  storageBucket: "manahseva-6b5e1.appspot.com",
  messagingSenderId: "57640435336",
  appId: "1:57640435336:web:11e4157b62171d4f05a93d",
  measurementId: "G-DR5J9H7FXP",
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
