import { getAuth, signInWithPopup } from "firebase/auth";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
export default function GAuth() {
  const navigate = useNavigate();
  async function onGClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      //check if user exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/Dashboard");
      toast.success("Sign In was successful");
      
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  }
  return (
    <button
      type="button"
      onClick={onGClick}
      className="flex items-center justify-center w-full bg-red-600 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg active:shadow-2xl transition duration-150 ease-in-out rounded "
    >
      <FcGoogle className="text-2xl bg-white rounded-full mr-2"></FcGoogle>
      Continue with Google
    </button>
  );
}
