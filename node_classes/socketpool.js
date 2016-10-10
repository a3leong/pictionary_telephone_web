function SocketPool(socketArray) {
  this.socketPool = socketArray;
}

SocketPool.prototype.addSocket = function(ws) {
  this.socketPool.push(ws);
};

SocketPool.prototype.closeSockets = function(ws) {
  for(ws in this.socketPool) {
    ws.close();
  }
};

SocketPool.prototype.broadcast = function(message) {
  for(var i=0;i<this.socketPool.length;i++) {
    this.socketPool[i].send(message);
  }
};

SocketPool.prototype.socketCount = function() {
  return this.socketPool.length;
};

module.exports = SocketPool;