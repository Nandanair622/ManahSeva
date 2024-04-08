import React, { useRef } from 'react';
import Messages from './Messages';
import SendMessage from './SendMessage';
import Footer from "../components/Footer";

const style = {
  chatHeader: 'bg-213555 p-4 border-b border-gray-300 text-center text-xl font-semibold text-D8C4B6',
  chatInterface: 'flex flex-col flex-grow', 
  chatMessages: 'flex-grow p-4 overflow-y-auto', 
};

const Chat = () => {
  const dummy = useRef();

  return (
    <>
      <div className={style.chatInterface}>
        <div className={style.chatHeader}>
          <h2 style={{ fontFamily: 'cursive' }}>Share your thoughts here!</h2>
        </div>
        <div className={`${style.chatMessages} overflow-hidden overflow-y-auto`}>
          <Messages />
          <span ref={dummy}></span>
        </div>
        <SendMessage />
      </div>
      
    </>
  );
};

export default Chat;
