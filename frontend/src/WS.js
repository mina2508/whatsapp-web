import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const serverUrl = 'http://localhost:5000';
const socket = io.connect(serverUrl);

const WS = () => {
  const inputRef = useRef();
  const messagesRef = useRef();
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [flag, setflag] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (clientId) {
      socket.emit(
        'chat specific client',
        clientId,
        socket.id,
        inputRef.current.value
      );
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    socket.on('bring clients list', (clientIds) => {
      const clietsWithoutMe = clientIds.filter(
        (client) => client !== socket.id
      );
      setClients(clietsWithoutMe);
    });
    socket.on('connect specific client', (socketId) => {
      setClientId(socketId);
      setflag(true);
    });
    socket.on('chat specific client message', function (msg) {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('group chat message', function (msg) {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('group chat clients', function (msg) {
      setClients((prev) => [...prev, msg]);
    });
  }, []);

  const handleClickClient = (clientId) => {
    setClientId(clientId);
    socket.emit('connect specific client', clientId, socket.id);
    setflag(true);
  };

  return (
    <div>
      <div className="header">
        <h2>WhatsApp Web</h2>
        {flag ? (
          <h3 style={{ color: 'blue' }}>User Selected Id{clientId}</h3>
        ) : (
          <h3 style={{ color: 'red' }}>Please Select A User</h3>
        )}
        <h3>List of Users</h3>
        <ul ref={messagesRef} id="messages">
          {clients.map((client) => (
            <li key={Math.ceil(Math.random() * 10000)}>
              <button onClick={() => handleClickClient(client)}>
                {client}
              </button>
            </li>
          ))}
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
            placeholder="Enter your message"
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

export default WS;
