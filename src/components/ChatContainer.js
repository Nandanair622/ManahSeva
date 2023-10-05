import React from 'react';
import Chat from './Chat';

const style = {
  home: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    border: '2px solid black',
    backgroundColor: '#a7bcff',
    borderRadius: '10px',
    width: '95%',
    height: '90%',
    display: 'flex',
    overflow: 'hidden',
  },
};

const ChatContainer = () => {
  return (
    <div style={style.home}>
      <div style={style.container}>
        <Chat />
      </div>
    </div>
  );
};

export default ChatContainer;
