const crypto = require('crypto');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function(ws) {
  console.log("client joined.");

  // send "hello world" interval
  // const textInterval = setInterval(() => ws.send("hello world!"), 100);

  // send random bytes interval
  // const binaryInterval = setInterval(() => ws.send(crypto.randomBytes(8).buffer), 110);

  ws.on('message', function(data) {
    if (typeof(data) === "string") {
      // client sent a string
      console.log("string received from client -> '" + data + "'");

      // Send message only to 1 client
      // ws.send("Server: " + data);

      // Send message to all clients
      wss.broadcast(data);

    } else {
      console.log("binary received from client -> " + Array.from(data).join(", ") + "");
    }
  });

  ws.on('close', function() {
    console.log("client left.");
    // clearInterval(textInterval);
    // clearInterval(binaryInterval);
  });
});

wss.broadcast = function broadcast(msg) {
  console.log(msg);
  wss.clients.forEach(function each(client) {
      client.send(msg);
   });
};

server.listen(process.env.PORT || 8080, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
