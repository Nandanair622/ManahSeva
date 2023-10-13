import React, { useEffect, useState, useRef } from 'react';
import checkForBullying from "../bullyDetection";
import { getAuth } from "firebase/auth"; 
import sendBullyWarningEmail from '../email'
import { db } from "../firebase";
import { deleteDoc, doc, collection, getDocs, query, where } from "firebase/firestore";


const style = {
  message: `flex items-center shadow-xl m-4 py-2 px-3  rounded-tl-full rounded-tr-full `,
  name: ` mt-[-4rem] text-gray-600 text-xs`,
  sent: `bg-[#395dff] text-white flex-row-reverse text-start float-right rounded-bl-full`,
  received: `bg-[#e5e5ea]  flex-row-reverse text-black float-left rounded-br-full`,
  timestamp: 'mb-[-4rem]  text-gray-600 text-xs',
};

const Message = ({ message, userEmail }) => {
  const [isBullying, setIsBullying] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    
    const checkBullying = async () => {
      const detectedAsBullying = await checkForBullying(message.text);
      setIsBullying(detectedAsBullying);

      if (detectedAsBullying && !emailSent) { // Check if bullying is detected and the email hasn't been sent yet
          sendBullyWarningEmail(userEmail);
          setEmailSent(true); // Set the emailSent state to true to indicate that the email has been sent
        }

      if (detectedAsBullying) {
        try {
        // Query the Firestore collection to find documents with matching content
        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("text", "==", message.text));
        const querySnapshot = await getDocs(q);
        
        // Iterate over the matching documents and delete them
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log("Message deleted because it contains bullying content.");
        });
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
    };

    checkBullying();
  }, [message.id, message.text, userEmail]);

  

  const auth = getAuth();
  const userId = auth.currentUser.uid;

  const messageClass = 
    message.userRef === userId
    ? `${style.sent}`
    : `${style.received}`;
    
  return (
    <div ref={ref}>
      <div className={`${style.message} ${messageClass}`}>
        <p className={style.name}>{message.name}</p>
        {isBullying ? (
          <p className="text-red-500">Warning: This message may contain bullying content.</p>
        ) : (
          <p>{message.text}</p>
        )}
      </div>
    </div>
  );
};

export default Message;
