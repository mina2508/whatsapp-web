import React, { useEffect, useState, useRef } from 'react';
// import './ws.css';
import io from 'socket.io-client';
const Url = 'http://localhost:5000';
const socket = io(Url);

const WSgroupChat = () => {
  const inputRef = useRef();
  const messagesRef = useRef();
  const [messages, setMessages] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (inputRef.current.value) {
      socket.emit('server group  messages', inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    socket.on('group messages', function (msg) {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  return (
    <div>
      <div className="header">
        <ul ref={messagesRef} id="messages">
          <h2>WhatsApp Web</h2>
          <h3>Group chat</h3>
        </ul>
      </div>
      <div className="message-container">
        <ul ref={messagesRef} id="messages">
          {messages.map((message) => (
            <li key={Math.ceil(Math.random() * 10000)}>{message}</li>
          ))}
        </ul>
        <form id="form" onSubmit={submitHandler}>
          <input
            placeholder="Enter message"
            id="input"
            ref={inputRef}
            required
          />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default WSgroupChat;
