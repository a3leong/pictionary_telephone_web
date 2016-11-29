var Config = require("../config");
var Err = require('./errmsg');
var Player = require('./player');

function PlayerPool(socketArray = []) {
  this.playerPool = socketArray;
}

PlayerPool.prototype.getSize = function() {
  return this.playerPool.length;
};

PlayerPool.prototype.addPlayer = function(playerId, ws) {
  if(this.playerPool.size>=Config.maxPlayers) {
    throw new Error(Err.FULL_LOBBY);
  }
  stringId = playerId.toString();   // In case a number is passed somehow
  if(this.containsPlayerId(playerId)) {
    throw new Error(Err.PLAYER_ID_EXISTS);
  } else if(this.containsSocket(ws)) {
    throw new Error(Err.CONNECTION_EXISTS)
  } else {
    this.playerPool.push(new Player(ws, stringId));
  }
};

PlayerPool.prototype.removePlayer = function(playerId) {
  for(var i=0;i<this.playerPool.length;i++) {
    if(this.playerPool[i].getId() === playerId) {
      this.playerPool[i].closeSocket();
      this.playerPool.splice(i,1);
      return;
    }
  }
  throw new Error(Err.PLAYER_ID_DNE);
};

PlayerPool.prototype.closeSockets = function() {
  for(var i=0;i<this.playerPool.length;i++) {
      this.playerPool[i].closeSocket();
  }
};

PlayerPool.prototype.closeSocket = function(playerId) {
  for(var i=0;i<this.playerPool.length;i++) {
    if(this.playerPool[i].getId() === playerId) {
      this.playerPool[i].closeSocket();
      return;
    }
  }
  throw new Error(Err.PLAYER_ID_DNE);
};

PlayerPool.prototype.containsPlayerId = function(playerId) {
  for(var i=0;i<this.playerPool.length;i++) {
    if(this.playerPool[i].getId() === playerId) {
      return true;
    }
  }

  return false;
};

PlayerPool.prototype.containsSocket = function(ws) {
  for(var i=0;i<this.playerPool.length;i++) {
    if(this.playerPool[i].getSocket() === ws) {
      return true;
    }
  }
  return false;
};

PlayerPool.prototype.getPlayerIds = function() {
  var returnArray = [];
  for(var i=0;i<this.playerPool.length;i++) {
    returnArray.push(this.playerPool[i].getId());
  }
  return returnArray;
};

PlayerPool.prototype.sendMessage = function(playerId, message) {
  for(var i=0;i<this.playerPool.length;i++) {
    if(this.playerPool[i] === playerId) {
      this.playerPool[i].sendMessage(message);
      return;
    }
  }

  throw new Error(Err.PLAYER_ID_DNE);
};

PlayerPool.prototype.broadcast = function(message) {
  for(var i=0;i<this.playerPool.length;i++) {
    this.playerPool[i].sendMessage(message);
  }
};



module.exports = PlayerPool;