// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmw1L6OJXf50SMGdk7wLlgA88UCYqb_YY",
  authDomain: "major-project-a76c4.firebaseapp.com",
  projectId: "major-project-a76c4",
  storageBucket: "major-project-a76c4.appspot.com",
  messagingSenderId: "916615136510",
  appId: "1:916615136510:web:fc8edf441bb6e96db491af",
  measurementId: "G-77PRD41ZCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);