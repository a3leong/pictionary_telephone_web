function CanvasData(playerId, canvasURL) {
  this.playerId = playerId;        // playerId
  this.canvasURL = canvasURL;            // String
}

CanvasData.prototype.getPlayerId = function() {
  return this.playerId;
};

CanvasData.prototype.getcanvas = function() {
  return this.canvasURL;
};


module.exports = CanvasData;