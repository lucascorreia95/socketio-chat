const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const httpServer = http.createServer(app);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});

module.exports = {
  httpServer,
};
