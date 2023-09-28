import React, { useEffect, useState } from 'react';
import {auth} from '../firebase'
import checkForBullying from '../bullyDetection'; // Adjust the path as needed

const style = {
  message: `flex items-center shadow-xl m-4 py-2 px-3 rounded-tl-full rounded-tr-full`,
  name: `absolute mt-[-4rem] text-gray-600 text-xs`,
  sent: `bg-[#395dff] text-white flex-row-reverse text-end float-right rounded-bl-full`,
  received: `bg-[#e5e5ea] text-black float-left rounded-br-full`,
};

const Message = ({ message }) => {
  const [isBullying, setIsBullying] = useState(false);

  useEffect(() => {
    const checkBullying = async () => {
      const detectedAsBullying = await checkForBullying(message.text);
      setIsBullying(detectedAsBullying);
    };

    checkBullying();
  }, [message.text]);

  const messageClass = 
    message.uid === auth.currentUser.uid
    ? `${style.sent}`
    : `${style.received}`;

  return (
    <div >
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