function Game(id, playerPool, phraseTime, drawTime) {
  this.id = id;
  this.playerPool = playerPool;
  this.phraseTime = phraseTime;
  this.drawTime = drawTime;
}

Game.prototype.closeSockets = function() {
  this.playerPool.closeSockets();
};

Game.prototype.handleMessage = function(msg) {

};

module.exports = Game;