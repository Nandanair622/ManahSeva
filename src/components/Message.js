import React, { useEffect, useState, useRef } from 'react';
import checkForBullying from "../bullyDetection";
import { getAuth } from "firebase/auth"; 
import sendBullyWarningEmail from '../email'


const style = {
  message: `flex items-center shadow-xl m-4 py-2 px-3  rounded-tl-full rounded-tr-full `,
  name: ` mt-[-4rem] text-gray-600 text-xs`,
  sent: `bg-[#395dff] text-white flex-row-reverse text-start float-right rounded-bl-full`,
  received: `bg-[#e5e5ea]  flex-row-reverse text-black float-left rounded-br-full`,
  timestamp: 'mb-[-4rem]  text-gray-600 text-xs',
};

const Message = ({ message, userEmail, uid }) => {
  const [isBullying, setIsBullying] = useState(false);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    const checkBullying = async () => {
      const detectedAsBullying = await checkForBullying(message.text);
      setIsBullying(detectedAsBullying);

      if (detectedAsBullying) {
        sendBullyWarningEmail(userEmail);
      }
    };

    checkBullying();
  }, [message.text, userEmail]);

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
