SocketPool = require('./socketpool');
GameTimer = require('./gametimer');

function GameInstance(gameId, playerSockets = []) {
    this.gameRunning = false;
    this.roundNumber = 0;
    this.gameId = gameId;
    this.playerSockets = new SocketPool(playerSockets);
    this.GameTimer = new GameTimer(this.playerSockets);
    this.drawRoundTime = 30;
    this.phraseRoundTime = 10;
    this.imageData = [];
    this.phraseData = [];  // TODO handle ordering on recieving
    this.context = this;
};


GameInstance.prototype.getConfig = function() {
  // playerCount is the players id as well if it hasn't been set yet
  return {
    type: 'gamestate',
    data:{
      state: 'config',
      gameId: this.gameId,
      playerCount: this.getPlayerCount(),
      drawRoundTime: this.drawRoundTime,
      phraseRoundTime: this.phraseRoundTime
    } 
  };      
};

GameInstance.prototype.addPlayer = function(ws) {
  this.playerSockets.addSocket(ws);
  // Send all data because new player needs info, simpler to just resend to all
  this.sendMessage(JSON.stringify(this.getConfig()));
};

GameInstance.prototype.getPlayerCount = function() {
  return this.playerSockets.socketCount();
};

GameInstance.prototype.sendMessage = function(message) {
  this.playerSockets.broadcast(message);
};

GameInstance.prototype.sendGamestate = function(state, data = null) {
    this.sendMessage(JSON.stringify({
      type: "gamestate",
      data: data
    }));
};

GameInstance.prototype.sendSetupInfo = function() {
    this.sendMessage(JSON.stringify({
      type: "gamestate",
      state: "config",
      drawRoundTime: this.drawRoundTime,
      phraseRoundTime: this.phraseRoundTime
    }));
};

GameInstance.prototype.isGameOver = function() {
  if(this.roundNumber < this.getPlayerCount()) {
    return false;
  } else {
    return true;
  }
}

GameInstance.prototype.startGame = function(){
  this.gameRunning = true;
  this.updateGame(this.context);
};

GameInstance.prototype.updateGame = function(context){
  if(context.isGameOver()) {
    console.log(context.roundNumber);
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