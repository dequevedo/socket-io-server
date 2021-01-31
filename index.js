const crypto = require('crypto');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();

const server = createServer(app);
const wss = new WebSocket.Server({ server });
const Users = {}

wss.on('connection', function(ws,req) {
  console.log("client joined.");


   //wss.broadcast(data);



  ws.on('message', function(data) {

    if (typeof(data) === "string") {

      data =  JSON.parse(data);
     
    //objeto que repesenta a funcão correspondente por tipo
    const type = {
        log : function(ws,data){
          console.log(data)
        },
        connection : function(ws,data){

          console.log("socket_id : ",data.socket_id )
          if(!Users[data.socket_id]){
            console.log(Users[data.socket_id])

            Users[data.socket_id] = data.user

            console.log(Users)
            ws.send(JSON.stringify({type:'success',success : true}));

          }else{

            ws.send(JSON.stringify({type:'success',success : false}));
          
          }
        },
        get_users: function(ws,data){
           ws.send(JSON.stringify({type:'get_users', sUsers}));

        }



    }

    if(data.type){
      type[data.type](ws,data.data)
    }else{
      
      console.log("Message type not faund")
      console.log(data)

    }

      //wss.broadcast(data);

    } else {
     
    }
  });

  ws.on('close', function() {
    console.log("client left.");

  });
});

wss.broadcast = function broadcast(msg) {
  wss.clients.forEach(function each(client) {
      client.send(msg);
   });
};

server.listen(process.env.PORT || 8080, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
//------------------------------------------------------------------------------------------------------------

 // const textInterval = setInterval(() => ws.send("hello world!"), 100);

  // send random bytes interval
  // const binaryInterval = setInterval(() => ws.send(crypto.randomBytes(8).buffer), 110);

 // client sent a string
      // console.log("string received from client -> '" + data + "'");

      // Send message only to 1 client
      // ws.send("Server: " + data);

      // Send message to all clients

          // clearInterval(textInterval);
    // clearInterval(binaryInterval);