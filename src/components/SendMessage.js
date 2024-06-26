import React, { useState } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {BsFillSendFill} from "react-icons/bs";

const style = {
  form: `h-14 w-full flex text-xl`, 
  input: `h-14 w-[90%] text-xl p-3 bg-213555 text-white outline-none border-none`,
  button: `h-14 w-[10%] bg-red-400 flex items-center justify-center`,
};

const SendMessage = ({ scroll }) => {
  const [formValue, setFormValue] = useState('');
  const auth = getAuth();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (formValue === '') {
        alert('Please enter a valid message')
        return
    }

    // Get the current user
    const user = auth.currentUser;

    if (user) {
      const { uid, displayName } = user;

      try {
        // Add the message to Firestore
        await addDoc(collection(db, "messages"), {
          text: formValue,
          name: displayName,
          userRef: uid, 
          timestamp: serverTimestamp(),
        });

        // Clear the input field
        setFormValue('');

      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  return (
    <div >
    <form onSubmit={sendMessage} className={style.form} >
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" className={style.input}/>
      <button type="submit" disabled={!formValue} className={style.button}><BsFillSendFill className="mr-2 text-xl" />  </button>
    </form>
    </div>
  );
};

export default SendMessage;
