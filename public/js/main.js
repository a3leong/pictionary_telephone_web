function dom_handler() {

};


// Do not let this handle DOM, should have an instance of the DOM handler
function event_handler() {
  current_state = null;
  this.handle_event = function(event) {
    event_object = JSON.parse(event);
    switch(event_object.type) {
      case 'game_state':
        this.handle_gamestate(event_object.data);
        break;
      case 'socket_connection':
        this.handle_socket_connection(event_object.data);
        break;
      default:
        console.log("Unidentified payload type received");
        throw ("Unidentified payload type received");
    }
  };


  // TODO redo
  this.handle_gamestate = function(data) {
    if(current_state!==data['state']) {
      console.log("new state");
      current_state = data['state'];
      // Call dom manipulator here
    } else {
      console.log("Same state");
      // call dom manipulator here
    }

    switch(data['state']) {
      case 'config':
        console.log("Config state");
        // Update in dom
        break;
      case 'game_state':
        console.log("Game state");
        // Update in dom
        break;

    }
    if(data['state'] == 'config') {

    }
    alert(data);
  }

  // this.handle_socket_connection = function(event_object) {
  //   if(event_object['status']==='success') {
  //     alert(event_object['pid']);
  //     return event_object['pid'];
  //   } else if(event_object['status']==='error') {
  //     throw "Error: " + event_object['msg'];
  //   } else {
  //     throw "Error: Web socket status not recognized";
  //   }
  // };

  // this.handle_setup_info = function(event_object) {
  //   return event_object['player_count'];
  // }
}

var ws = new WebSocket("ws://localhost:3000");

ws.onopen = function() {
  alert("Socket ready");
};

ws.onmessage = function(event) {
  var received_msg = event.data;
  var obj = JSON.parse(received_msg);
  // alert("Message is recieved: " + received_msg);
  document.getElementById("game_id_input").value = obj.data.game_id;
  document.getElementById("response").innerHTML = received_msg;
};

function createGame() {
  ws.send(JSON.stringify({type: 'create_game_instance'}));
}

function joinGame() {
  var game_id = document.getElementById("game_id_input").value;
  ws.send(JSON.stringify({type: 'join_game_instance', data:{game_id:game_id}}));
}

function startGame() {
  var game_id = document.getElementById("game_id_input").value;
  ws.send(JSON.stringify({type: 'start_game_instance', data:{game_id:game_id}}));
}