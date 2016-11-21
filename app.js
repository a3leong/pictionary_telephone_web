var server = require('http').createServer()
  , path = require('path')
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , RoomManager = require('./node_classes/roommanager')
  , GameManager = require('./node_classes/gamemanager')
  , MessageHandler = require('./node_classes/messagehandler.js')
  , app = express()
  , port = 3001
  , GameInstance = require('./node_classes/gameinstance');

app.use("/", express.static(__dirname + "/api_tester"));

// app.get("/index", function(req, res) {
//   res.render('./api_tester/index.html');
// });

var messageHandler = new MessageHandler(new RoomManager, new GameManager);

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });

// app TODO
app.get('/api/createroom', function(req, res) {
  var roomId = messageHandler.createRoom();
  res.json(roomId);   
  console.log(roomId);
});


wss.on('connection', function connection(ws) {
  console.log("Connection set");
  ws.send("Connection set");
 
  ws.on('message', function incoming(message) {
    console.log(message);
    handleMessage(message, ws);
  });
});

function handleMessage(message, ws) {
  messageHandler.handleMessage(message, ws)
}