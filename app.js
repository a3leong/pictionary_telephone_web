var server = require('http').createServer()
  , path = require('path')
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , app = express()
  , port = 3000
  , GameInstance = require('./node_classes/gameinstance');

app.use("/public", express.static(__dirname + "/public"));

// app.use(function (req, res) {
//   res.sendFile(path.join(__dirname + '/content/index.html'));
//   // res.send({ msg: "hello" });
// });

var gameInstanceDict = {};

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });

wss.on('connection', function connection(ws) {
  console.log("Connection set");
  // TODO, let the client class handle this
  // if(!game_started) {
  //   socket_array.push(ws);
  //   ws.send(JSON.stringify({
  //     type: "socket_connection",
  //     status: "success",
  //     player_id: number_of_players
  //   }));
  //   number_of_players += 1;
  //   ws.send(JSON.stringify({
  //     type: "setup_info",
  //     player_count: number_of_players
  //   }));
  // } else {
  //   ws.send(JSON.stringify({
  //     type: "socket_connection",
  //     status: "error",
  //     errMsg: "Game has already started!"
  //   }));
  // }

  // var location = url.parse(ws.upgradeReq.url, true);
  // // you might use location.query.access_token to authenticate or share sessions
  // // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log(message);
    handleMessage(message, this);
  });
});

function handleMessage(message, playerSocket) {
  console.log(message);
  messageObject = JSON.parse(message);
  switch(messageObject.type) {
    case 'createGameInstance':
      createGame(messageObject.data, playerSocket);
      break;
    case 'joinGameInstance':
      joinGame(messageObject.data, playerSocket);
      break;
    case 'startGameInstance':
      startGame(messageObject.data);
      break;
    case 'roundDataSend':
      recieveRoundData(messageObject.data);
      break;
    case 'updateConfigOption':
      updateConfigOption(messageObject.data);
      break;
    default:
      // TODO throw later
      console.log("Error: Message type '" + messageObject.type +"' not expected");
  }
}

function createGame(data, playerSocket) {
  var id = makeid();
  while(gameInstanceDict[id] != null && gameInstanceDict[id] != undefined) {
    id = makeid(); // Since we expect low amount of users, we just regen an id until we getConfig a free one
  }
  gameInstanceDict[id] = new GameInstance(id);
  gameInstanceDict[id].addPlayer(playerSocket, data.playerId);
  playerSocket.send(JSON.stringify(gameInstanceDict[id].getConfig()));
}

function joinGame(data, playerSocket) {
  console.log('join client');
  var currentInstance = gameInstanceDict[data.gameId];
  if(currentInstance) {
    currentInstance.addPlayer(playerSocket, data.playerId);
    // Send all data because new player needs info, simpler to just resend to all
    currentInstance.sendMessage(JSON.stringify(currentInstance.getConfig()));
  } else {
    send(JSON.stringify(generateErrorMessage("Could not find game client")));
  }
}

function startGame(data) {
  console.log("Start game");
  console.log(data.gameId);
  if(gameInstanceDict[data.gameId]) {
    gameInstanceDict[data.gameId].startGame();
  } else {
    send(JSON.stringify(generateErrorMessage("Could not find game client")));
  }
}

function recieveRoundData(data) {
  console.log('recieveRoundData');
}

function updateConfigOption(data) {
  console.log('updateConfigOption');
}

function generateErrorMessage(errMsg) {
  return {
    type: "error",
    data: {
      errMsg: errMsg
    }
  };
}

// http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}