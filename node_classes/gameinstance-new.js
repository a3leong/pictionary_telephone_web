// Game instance removing config stuff

PlayerPool = require('./playerpool');
GameTimer = require('./gametimer');
Player = require('./Player');
Book = require('./book');

function GameInstance(playerArray, phraseTime, drawTime) {
    this.gameRunning = false;
    this.roundNumber = 0;
    this.playerPool = new PlayerPool(playerArray);
    this.GameTimer = new GameTimer(this.playerPool);
    this.drawRoundTime = drawTime;
    this.phraseRoundTime = phraseTime;
    this.playerBooks = {};  // Dictionary of each players book data as array
    this.context = this;
};

GameInstance.prototype.getPlayerCount = function() {
  return this.playerPool.playerCount();
};

GameInstance.prototype.sendMessage = function(message) {
  this.playerPool.broadcast(message);
};

GameInstance.prototype.isGameOver = function() {
  if(this.roundNumber < this.getPlayerCount()) {
    return false;
  } else {
    return true;
  }
};

GameInstance.prototype.startGame = function(){
  this.gameRunning = true;
  this.updateGame(this.context);
};

GameInstance.prototype.updateGame = function(context){
  if(context.isGameOver()) {
    context.gameRunning = false;
    context.sendResults(context);
  }
  else {
    if((context.roundNumber++)%2==0){
      context.startPhraseRound(context);
    } else {
      context.startDrawRound(context);
    }
  }
};

GameInstance.prototype.getPlayerIds = function() {
  return this.playerPool.getPlayerIds();
}

GameInstance.prototype.startPhraseRound = function(context){
  // message.send(JSON.stringify({
  //   type: "gamestate",
  //   data: {state: "phrase"}
  // }));
  this.GameTimer.timerCallback(this.phraseRoundTime, this.updateGame, context, broadcast=true);
};

GameInstance.prototype.startDrawRound = function(context){
  // message.send(JSON.stringify({
  //   type: "gamestate",
  //   data: {state: "draw"}
  // }));
  this.GameTimer.timerCallback(this.drawRoundTime, this.updateGame, context, broadcast=true);
};

GameInstance.prototype.addPlayerPage = function(playerId, data) {
  this.playerBooks[playerId].addPage(data);
};

GameInstance.prototype.sendResults = function(context){
  console.log("Game over");
  // message.send(JSON.stringify({
  //   type: "gamestate",
  //   state: "results"
  // }));
  // // TODO: fix later
  // this.sendMessage(this.imageData);
};

module.exports = GameInstance;