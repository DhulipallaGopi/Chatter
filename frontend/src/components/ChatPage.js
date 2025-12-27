import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import '../App.css';
import { FaPaperPlane } from 'react-icons/fa';
import { io } from 'socket.io-client';

// Use environment variable for backend URL
const socket = io(process.env.REACT_APP_BACKEND_URL, {
  transports: ['websocket', 'polling'],
});

const ChatPage = () => {
  const { username } = useParams();
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    socket.on('chat', (chatMessage) => {
      setChats((prevChats) => [...prevChats, chatMessage]);
    });

    return () => socket.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat', { sender: username, message });
      setMessage('');
    }
  };

  return (
    <main>
      <Header />
      <Link to='/' className='logout-link'>LOGOUT</Link>
      <div className='chat-container' ref={chatContainerRef}>
        {chats.map((chat, index) => (
          <div
            key={index}
            className={chat.sender === username ? 'my-chat' : 'notmy-chat'}
          >
            <span className='user'>
              {chat.sender === username ? `You` : chat.sender}
            </span>
            <span className='msg'>{chat.message}</span>
          </div>
        ))}
      </div>
      <div className='chatbox-container'>
        <div className='chatbox'>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Enter a new message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() =>
                chatContainerRef.current.scrollTo({
                  top: chatContainerRef.current.scrollHeight,
                  behavior: 'smooth',
                })
              }
            />
            <button type='submit'>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
//adding commet

export default ChatPage;
