const express = require("express");
const http = require("http");

const app = express();
const httpServer = http.createServer(app);

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/index.html");
});

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
