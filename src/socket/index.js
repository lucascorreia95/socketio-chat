const socketIo = require('socket.io');
const {
  addUserToList,
  addTypingToUsersList,
  getUserFromList,
  getUsersTypingFromList,
  removeUserFromList,
  removeTypingFromUsersList,
} = require('../data');

const socketCreator = (httpServer) => {
  const io = socketIo(httpServer);

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      const user = getUserFromList(socket.id);
      if (user) {
        io.emit('user disconnected', `${user.nickname} left the chat`);
      } else {
        io.emit('user disconnected', 'Someone left the chat');
      }
      io.emit('list users', removeUserFromList(socket.id));
    });

    socket.on('chat message', (msg, room) => {
      const user = getUserFromList(socket.id);
      let response = '';

      if (user) {
        response = `${user.nickname}: ${msg}`;
      } else {
        response = `Unknown: ${msg}`;
      }

      if (room) {
        socket.to(room).emit('chat message', response, socket.id);
      } else {
        socket.broadcast.emit('chat message', response, null);
      }
    });

    socket.on('nickname', (nickname) => {
      socket.broadcast.emit('user connected', `${nickname} joined the chat`);
      io.emit('list users', addUserToList(socket.id, nickname));
    });

    socket.on('is typing', (room) => {
      if (!room) {
        addTypingToUsersList(socket.id);
        socket.broadcast.emit('users typing', getUsersTypingFromList());
      } else {
        const user = getUserFromList(socket.id);
        socket.to(room).emit('users typing', [user], socket.id);
      }
    });

    socket.on('stoped typing', (room) => {
      if (!room) {
        removeTypingFromUsersList(socket.id);
        socket.broadcast.emit('users typing', getUsersTypingFromList());
      } else {
        socket.to(room).emit('users typing', [], socket.id);
      }
    });

    socket.on('private room', (id) => {
      const user = getUserFromList(socket.id);
      io.to(id).emit('private room', { id: user.id, nickname: user.nickname });
    });
  });
};

module.exports = socketCreator;
