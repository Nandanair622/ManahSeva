  import React, { useRef } from 'react';
  import Messages from './Messages';
  import SendMessage from './SendMessage';

  const style = {
    chatHeader: 'bg-gray-200 p-4 border-b border-gray-300 text-center text-xl font-semibold',
    chatInterface: 'flex flex-col flex-grow', 
    chatMessages: 'flex-grow p-4 overflow-y-auto', 
  };

  const Chat = () => {
    
  const dummy = useRef();
  
  return (
  <div className={style.chatInterface}>
    <div className={style.chatHeader}>
      <h2>Mental Health</h2>
    </div>
    <div className={`${style.chatMessages} overflow-hidden overflow-y-auto`}>
        <Messages />
        <span ref={dummy}></span>
      </div>
      <SendMessage/>
  </div>
  )
  };

  export default Chat;