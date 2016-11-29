var ws = undefined;

$(document).ready(function() {
  $("#player-id").val(generateRandomName());
});


function createGame() {
  return new Promise(function(resolve,reject) {
    $.get('http://localhost:3001/api/createroom').then(function(data){
      console.log(data);
      resolve(data);
    });
  });
}
// {"type": "kickPlayer", "data": {"gameId":"hxqyp", "playerId":"DummyPlayer"}}
function joinGame() {
  var gameId = $("#game_id_input").val();
  $("#lobbyid").html(gameId);
  var playerId = $("#player-id").val();
  console.log("gameid: " + gameId);
  console.log("playerid: " + playerId);
  ws = new WebSocket("ws://localhost:3001");
  showRoom();
  ws.onopen = function(){
    ws.send(JSON.stringify({
      type: "joinGameInstance",
      data: {
        gameId: gameId,
        playerId: playerId
      }
    }));
  };

  ws.onmessage = function(event) {
    console.log("event");
    console.log(event.data);
    if(event.data!=='Connection set') {
      var obj = JSON.parse(event.data);
      var data = obj.data;
      console.log(data.playerIds);
      showPlayers(data.playerIds);
    }
  };

}

function createGameAndSocketConnect() {
  createGame().then(function(data) {
    var gameId = data;
    ws = new WebSocket("ws://localhost:3001");
    showRoom();
    //var config = JSON.parse(data);
    $("#lobbyid").html(gameId);
    console.log("Addplayer");

    ws.onopen = function() {
      alert("Socket ready");
      ws.send(JSON.stringify({
        type: "joinGameInstance",
        data: {
          gameId: gameId,
          playerId: $("#player-id").val()
        }
      }));
    };

    ws.onmessage = function(event) {
      console.log("event");
      console.log(event.data);
      if(event.data!=='Connection set') {
        var obj = JSON.parse(event.data);
        var data = obj.data;
        console.log(data.playerIds);
        showPlayers(data.playerIds);
      }
    };
  });
}

function showRoom() {
  $("#create-game-screen").addClass("hidden");
  $("#room-screen").removeClass("hidden");
};

function showPlayers(playerList) {
  var players = '';

  for(var i=0;i<playerList.length;i++) {
    players += playerList[i] + '\n';
  }
  $('#players').val(players);
}

function sendCustomMessage() {
  if(!ws) {
    console.log(document.getElementById("custom-input-textarea").value);
    console.log("Websocket not init");
  } else {
    console.log("Send custom");
    ws.send(document.getElementById("custom-input-textarea").value);
  }
}

function startGame() {
  var gameId = $("#lobbyid").text();
  ws.send(JSON.stringify({
    type: 'startGameInstance',
    data: {
      gameId: gameId
    }
  }));
}

function generateRandomName() {
  var num = Math.floor((Math.random() * 1000) + 1);
  var nameSelector = Math.floor((Math.random()*10));
  var names = ['wes', 'sarah', 'kevin', 'jason', 'bernard', 'ruby', 'nadine', 'clement',
              'hannah', 'gilia'];
  var name = names[nameSelector]+"_"+String(num);
  return name;
}