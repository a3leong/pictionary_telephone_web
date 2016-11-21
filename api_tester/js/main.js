var ws = undefined;

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
  var playerId = $("#player-id").val();
  console.log("gameid: " + gameId);
  console.log("playerid: " + playerId);
  ws = new WebSocket("ws://localhost:3001");
  ws.onopen = function(){
    ws.send(JSON.stringify({
      type: "joinGameInstance",
      data: {
        gameId: gameId,
        playerId: playerId
      }
    }));
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
        var players = '';

        for(var i=0;i<data.playerIds.length;i++) {
          console.log("pid: " + data.playerIds[i]);
          players += data.playerIds[i] + '\n';
        }
        console.log("Players: " + players);
        $('#players').val(players);
      }
    };
  });
}

function showRoom() {
  $("#create-game-screen").addClass("hidden");
  $("#room-screen").removeClass("hidden");
};

function sendCustomMessage() {
  if(!ws) {
    console.log(document.getElementById("custom-input-textarea").value);
    console.log("Websocket not init");
  } else {
    console.log("Send custom");
    ws.send(document.getElementById("custom-input-textarea").value);
  }
}