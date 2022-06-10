const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const port = 5000;
const socketServer = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let flag = 0;
let clientIds = [];

socketServer.on('connection', (socket) => {
  if (flag % 2 == 0) {
    socket.broadcast.emit('group chat clients', socket.id);
    clientIds.push(socket.id);
  }
  flag++;
  if (flag == 1001) {
    flag = 0;
  }
  socketServer.to(socket.id).emit('bring clients list', clientIds);

  socket.on('connect specific client', (socketId, mySocketId) => {
    socketServer.to(socketId).emit('connect specific client', mySocketId);
  });

  socket.on('chat specific client', (socketId, mySocketId, msg) => {
    socketServer.to(socketId).emit('chat specific client message', msg);
    socketServer.to(mySocketId).emit('chat specific client message', msg);
  });

  socket.on('server group  messages', (msg) => {
    socketServer.emit('group messages', msg);
  });

  socket.on('disconnect', () => {
    clientIds = clientIds.filter((client) => client !== socket.id);
    socketServer.emit('bring clients list', clientIds);
  });
});

server.listen(port, () => {
  console.log(`listening on :${port}`);
});
