import React, { useRef, } from "react";
import { db } from "../firebase";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import checkForBullying from "../bullyDetection";
import { getAuth } from "firebase/auth";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Message from './Message';

const style = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    overflowY: 'auto',
  },
};

const Messages = () => {
  const messagesRef = query(collection(db, 'messages'), orderBy('timestamp'));
  const [messages] = useCollectionData(messagesRef, { idField: 'id' });
  const dummy = useRef();

  const handleBullyDetection = async (message) => {
    const isBullying = await checkForBullying(message.text);
    return isBullying;
  };

  const auth = getAuth();
  const userId = auth.currentUser.uid;
  
  return (
    <div style={style.main}>
      {messages &&
        messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg}
            userId={userId}
            userEmail={auth.currentUser.email}
            isBullying={handleBullyDetection(msg)}
          />
        ))}
      <span ref={dummy}></span>
    </div>
  );
};

export default Messages;
