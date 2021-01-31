const crypto = require('crypto');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();

const server = createServer(app);
const wss = new WebSocket.Server({ server });
const Users = {}

const GameState = {}

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
            Users[data.socket_id] = data.user

            console.log(Users)
            ws.send(JSON.stringify({type:'success',success : true}));
            //eviar uma mensagems para os outros clientes
          }else{

            ws.send(JSON.stringify({type:'success',success : false}));
          
          }
        },
        get_users: function(ws,data){
           ws.send(JSON.stringify({type:'get_users', Users}));

        },
        get_game_state :function(ws,data) {

          ws.send(JSON.stringify({type:'get_game_state', GameState}));

        },
        muvement : function(ws,data){

          Users[data.socket_id].position = data.position

          ws.send(JSON.stringify({type:'muvement', users_positions : get_others_users_position(data.socket_id)}));



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


function set_assasin(){
  let assasin = false
  for (let index = 0; index < Object.keys(Users).length; index++) {
    if(index == Object.keys(Users).length-1 && !assasin && Object.keys(Users)[index].assasin){
      Object.keys(Users)[index].assasin = false
      Object.keys(Users)[0].assasin = true
      assasin = true

    }else if(!assasin &&  Object.keys(Users)[index].assasin){
      Object.keys(Users)[index].assasin = false
      Object.keys(Users)[index+1].assasin = true
      assasin = true
    }
    
  }

  if(!assasin){
    Object.keys(Users)[0].assasin = true
  }

}


function get_roons_number(){
    return  Object.keys(Users).length * 4
}


function gameStart(){

  set_assasin()
  GameState['Users'] = Users
  GameState[roons_number] = get_roons_number()
}


function get_others_users_position(socket_id){
  const users_positions = {}

  for (const [key, value] of Object.entries(Users)) {
    if(key !== socket_id){

      users_positions[key] = Users[key].position
    }
  }

  return users_positions
}


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