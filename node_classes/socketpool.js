module.exports = {
  SocketPool: function(socketArray) {
    this.socketPool = socketArray;

    this.addSocket = function(ws) {
      this.socketPool.push(ws);
    }

    this.closeSockets = function(ws) {
      for(ws in this.socketPool) {
        ws.close();
      }
    }

    this.broadcast = function(message) {
      for(var i=0;i<this.socketPool.length;i++) {
        this.socketPool[i].send(message);
      };
    }

    this.socketCount = function() {
      return this.socketPool.length;
    };
  }
}