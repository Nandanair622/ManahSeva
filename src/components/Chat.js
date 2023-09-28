import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { db } from "../firebase";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import checkForBullying from "../bullyDetection";
import { getAuth } from "firebase/auth";
const style = {
  chatContainer: "flex h-screen",
  chatHeader: "bg-gray-200 p-4 border-b border-gray-300",
  chatList: "w-1/3 bg-gray-200 p-4 border-r border-gray-300 overflow-y-auto",
  chatInterface: "w-2/3 flex flex-col",
  main: `flex flex-col p-[10px]`,
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log(messages);
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  const handleBullyDetection = async (message) => {
    const isBullying = await checkForBullying(message.text);
    return isBullying;
  };

  // Get the currently authenticated user
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  // // Check if a user is signed in
  // if (user) {
  //   const userId = user.uid; // This is the user's ID
  //   // Now, you can use this userId in your components.
  // }

  return (
    <div className="flex h-screen">
      {/* Chat List (Left Side) */}
      <div className={style.chatList}>{/* Chat list content */}</div>

      {/* Chat Interface (Right Side) */}
      <div className={style.chatInterface}>
        <div className={style.chatHeader}>
          <h2 className="text-xl font-semibold">Mental Health</h2>{" "}
          {/* Adjust the title */}
        </div>
        {/* Chat Messages */}
        <main className={style.main}>
          {messages &&
            messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                userId={userId} // Pass the user ID to the Message component
                isBullying={handleBullyDetection(message)}
              />
            ))}
        </main>
        {/* Send Message Component */}
        <SendMessage scroll={scroll} />
      </div>

      {/* Scroll Indicator */}
      <span ref={scroll}></span>
    </div>
  );
};

export default Chat;
