// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortId = require('shortid');
app.use(express.static(__dirname));
var clients = [];

io.on('connection', function(socket){
    console.log("Someone connected, yey!")

    socket.on('beep', function() {
        console.log('test beep received')
    });
});

http.listen(process.env.PORT ||3000, function(){
    console.log('listening on *:3000')
});

console.log('Server.js is running')

