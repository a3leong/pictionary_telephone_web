PlayerPool = require('./playerpool');
GameTimer = require('./gametimer');
ClientInfo = require('./clientinfo');
Book = require('./book');

function GameInstance(gameId, sockets = []) {
    this.gameRunning = false;
    this.roundNumber = 0;
    this.gameId = gameId;
    this.playerPool = new PlayerPool();
    this.GameTimer = new GameTimer(this.playerPool);
    this.drawRoundTime = 30;
    this.phraseRoundTime = 10;
    this.playerBooks = {};
    this.context = this;
};

GameInstance.prototype.getConfig = function() {
  // playerCount is the players id as well if it hasn't been set yet
  return {
    type: 'config',
    data:{
      gameId: this.gameId,
      playerCount: this.getPlayerCount(),
      playerIds: this.getPlayerIds(),
      drawRoundTime: this.drawRoundTime,
      phraseRoundTime: this.phraseRoundTime
    } 
  };      
};

GameInstance.prototype.addPlayer = function(ws, playerId) {
  // TODO, check for existing id
  this.playerPool.addPlayer(new ClientInfo(ws, playerId));
  this.playerBooks['playerId'] = new Book();
  return true;
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