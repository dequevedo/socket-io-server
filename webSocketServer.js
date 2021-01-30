#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});

var connectionList = [];

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connectionList.push(connection);
  console.log(connectionList.length);

  console.log((new Date()) + ' Player ' + connection.remoteAddress + ':' + connection.socket._peername.port + ' is now connected');
  for (let socket of connectionList) {
    socket.send((new Date()) + ' Player ' + connection.remoteAddress + ':' + connection.socket._peername.port + ' is now connected');
  }

  // console.log(JSON.stringify(object, null, 4));

  // connection.on('message', function (message) {
  //   if (message.type === 'utf8') {
  //     console.log('Received Message: ' + message.utf8Data);
  //     connection.sendUTF(message.utf8Data);
  //   }
  //   else if (message.type === 'binary') {
  //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
  //     connection.sendBytes(message.binaryData);
  //   }
  // });

  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Player ' + connection.remoteAddress + ':' + connection.socket._peername.port + ' disconnected.');
    for (let socket of connectionList) {
      socket.send((new Date()) + ' Player ' + connection.remoteAddress + ':' + connection.socket._peername.port + ' disconnected.');
    }
  });
});