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
// wss.on('connection', function connection(ws) {
//   console.log("Connection set");
 
//   ws.on('message', function incoming(message) {
//     console.log(message);
//     handleMessage(message, this);
//   });
// });

// app.all("/api/*", function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
//   return next();
// });


// app.all("/api/*", function(req, res, next) {
//   if (req.method.toLowerCase() !== "options") {
//     return next();
//   }
//   return res.send(204);
// });