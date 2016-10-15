function PlayerPool(socketArray = []) {
  this.playerPool = socketArray;
}

PlayerPool.prototype.addPlayer = function(player) {
  this.playerPool.push(player);
};

PlayerPool.prototype.closeSockets = function() {
  for(var i=0;i<this.playerPool.length;i++) {
      this.playerPool[i].closeSocket();
  }
};

PlayerPool.prototype.containsPlayerId = function(playerId) {
  for(var i=0;i<this.playerPool.length;i++) {
    if(this.playerPool[i].getId() === playerId) {
      return true;
    }
  }

  return false;
};

PlayerPool.prototype.closeSocket = function(playerId) {
  for(var i=0;i<this.playerPool.length;i++) {
    if(this.playerPool[i].getId() === playerId) {
      this.playerPool[i].closeSocket();
      this.playerPool.splice(i, 1);
      return true;
    }
  }
  return false;
};

PlayerPool.prototype.getPlayerPool = function() {
  return this.playerPool;
};

PlayerPool.prototype.getPlayerIds = function() {
  console.log("Get player ids");
  console.log("Size: " + this.playerPool.length);
  var returnArray = [];
  for(var i=0;i<this.playerPool.length;i++) {
    returnArray.push(this.playerPool[i].getId());
  }
  return returnArray;
};

PlayerPool.prototype.broadcast = function(message) {
  for(var i=0;i<this.playerPool.length;i++) {
    this.playerPool[i].sendMessage(message);
  }
};

PlayerPool.prototype.playerCount = function() {
  return this.playerPool.length;
};

module.exports = PlayerPool;