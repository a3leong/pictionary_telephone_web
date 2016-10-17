function Player(ws, id) {
  this.id = id;
  this.ws = ws;
}

Player.prototype.getId = function() {
  return this.id;
};

Player.prototype.getSocket = function() {
  return this.ws;
};

Player.prototype.closeSocket = function() {
  this.ws.close();
}

Player.prototype.sendMessage = function(message) {
  this.ws.send(message);
}

module.exports = Player;