const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

let users = [];

function getUserFromList(id) {
  const filtered = users.filter((user) => user.id === id);
  if (filtered.length > 0) {
    return filtered[0];
  }

  return null;
}

function removeUserFromList(id) {
  const filtered = users.filter((user) => user.id !== id);
  users = filtered;
  return null;
}

function addUserToList(id, nickname) {
  users.push({ id, nickname });
  return null;
}

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const user = getUserFromList(socket.id);
    removeUserFromList(socket.id);
    if (user) {
      io.emit('user disconnected', `${user.nickname} left the chat`);
    } else {
      io.emit('user disconnected', 'Someone left the chat');
    }
    io.emit('list users', users);
  });

  socket.on('chat message', (msg) => {
    const user = getUserFromList(socket.id);
    if (user) {
      socket.broadcast.emit('chat message', `${user.nickname}: ${msg}`);
    } else {
      socket.broadcast.emit('chat message', `Unknown: ${msg}`);
    }
  });

  socket.on('nickname', (nickname) => {
    addUserToList(socket.id, nickname);
    socket.broadcast.emit('user connected', `${nickname} joined the chat`);
    io.emit('list users', users);
  });
});

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
