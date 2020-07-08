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

    socket.on('chat message', (msg) => {
      const user = getUserFromList(socket.id);
      if (user) {
        socket.broadcast.emit('chat message', `${user.nickname}: ${msg}`);
      } else {
        socket.broadcast.emit('chat message', `Unknown: ${msg}`);
      }
    });

    socket.on('nickname', (nickname) => {
      socket.broadcast.emit('user connected', `${nickname} joined the chat`);
      io.emit('list users', addUserToList(socket.id, nickname));
    });

    socket.on('is typing', () => {
      addTypingToUsersList(socket.id);
      socket.broadcast.emit('users typing', getUsersTypingFromList());
    });

    socket.on('stoped typing', () => {
      removeTypingFromUsersList(socket.id);
      socket.broadcast.emit('users typing', getUsersTypingFromList());
    });
  });
};

module.exports = socketCreator;
