function ClientInfo(ws, id) {
  this.id = id;
  this.ws = ws;
}

ClientInfo.prototype.getId = function() {
  return this.id;
};

ClientInfo.prototype.getSocket = function() {
  return this.ws;
};

ClientInfo.prototype.closeSocket = function() {
  this.ws.close();
}

ClientInfo.prototype.sendMessage = function(message) {
  this.ws.send(message);
}

module.exports = ClientInfo;