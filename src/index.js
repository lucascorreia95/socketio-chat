const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const users = [];

function getUserFromList(id) {
  const filtered = users.filter((user) => user.id === id);
  if (filtered.length > 0) {
    return filtered[0];
  }

  return null;
}

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const user = getUserFromList(socket.id);
    io.emit('user disconnected', `${user.nickname} left the chat`);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('nickname', (nickname) => {
    users.push({ id: socket.id, nickname });
    io.emit('user connected', `${nickname} joined the chat`);
  });
});

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
