var server = require('http').createServer()
  , path = require('path')
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , app = express()
  , port = 3000
  , services = require('./services');

app.use("/public", express.static(__dirname + "/public"));

// app.use(function (req, res) {
//   res.sendFile(path.join(__dirname + '/content/index.html'));
//   // res.send({ msg: "hello" });
// });

var game_instance_dict = {};

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
  //     err_msg: "Game has already started!"
  //   }));
  // }

  // var location = url.parse(ws.upgradeReq.url, true);
  // // you might use location.query.access_token to authenticate or share sessions
  // // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log(message);
    handle_message(message, this);
  });
});

function handle_message(message, player_socket) {
  console.log(message);
  message_object = JSON.parse(message);
  switch(message_object.type) {
    case 'create_game_instance':
      create_game(message_object.data, player_socket);
      break;
    case 'join_game_instance':
      join_game(message_object.data, player_socket);
      break;
    case 'start_game_instance':
      start_game(message_object.data);
    case 'round_data_send':
      recieve_round_data(message_object.data);
      break;
    case 'update_config_option':
      update_config_option(message_object.data);
      break;
    default:
      // TODO throw later
      console.log("Error: Message type '" + message_object.type +"' not expected");
  }
}

function create_game(data, player_socket) {
  var id = makeid();
  while(game_instance_dict[id] != null && game_instance_dict[id] != undefined) {
    id = makeid(); // Since we expect low amount of users, we just regen an id until we get a free one
  }
  game_instance_dict[id] = new services.game_instance(id, [player_socket]);
  player_socket.send(JSON.stringify(game_instance_dict[id].get_config()));
}

function join_game(data, player_socket) {
  console.log('join client');
  console.log(data.game_id);
  if(game_instance_dict[data.game_id]) {
    game_instance_dict[data.game_id].add_player(player_socket);
  } else {
    send(JSON.stringify(generate_error_msg("Could not find game client")));
  }
}

function start_game(data) {
  console.log("Start game");
  console.log(data.game_id);
  if(game_instance_dict[data.game_id]) {
    game_instance_dict[data.game_id].start_game();
  } else {
    send(JSON.stringify(generate_error_msg("Could not find game client")));
  }
}

function recieve_round_data(data) {
  console.log('recieve_round_data');
}

function update_config_option(data) {
  console.log('update_config_option');
}

function generate_error_msg(err_msg) {
  return {
    type: "error",
    data: {
      err_msg: err_msg
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