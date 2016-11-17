var server = require('http').createServer()
  , path = require('path')
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , RoomManager = require('./node_classes/roommanager')
  , GameManager = require('./node_classes/gamemanager')
  , app = express()
  , port = 3001
  , GameInstance = require('./node_classes/gameinstance');

app.use("/", express.static(__dirname + "/api_tester"));

// app.get("/index", function(req, res) {
//   res.render('./api_tester/index.html');
// });

var roomManager = new RoomManager();
var gameManager = new GameManager();


server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });


app.get('/api/creategame', function(req, res) {
    var value = roomManager.createRoom();
    res.json({ message: value });   
    console.log(value);
});
