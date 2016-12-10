var GameTimer = require('./gametimer');
var Book = require('./book');
var MsgGen = require('./messagegenerator')
var Err = require('./errmsg');

function Game(id, playerPool, phraseTime, drawTime) {
  this.id = id;
  this.playerPool = playerPool;
  this.gameTimer = new GameTimer(this.playerPool);
  this.phraseTime = phraseTime;
  this.drawTime = drawTime;
  this.currentRound = 0;
  this.dataCollectionCount = 0;
  this.books = {};
  this.context = this;
  this.roundInProgress = false; // server-client synchronization
  this.gameStarted = false;     // server-client synchronization

  console.log("Game created: " + this.id + " phraseTime: " + this.drawTime);
}

Game.prototype.closeSockets = function() {
  this.playerPool.closeSockets();
};

Game.prototype.start = function() {
  // Start game
  // Init books
  this.initBooks();
  this.startRound();
};

Game.prototype.initBooks = function() {
  pids = playerPool.getPlayerIds();
  for(var pid in pids) {
    this.books[pid] = new Book();
  }
};

Game.prototype.isGameOver = function() {
  if(this.currentRound < this.playerPool.getSize()) {
    return false;
  } else {
    return true;
  }
};

Game.prototype.startGame = function() {
  this.playerPool.broadcast(MsgGen.generateGamestatusMsg('firstPhrase', undefined, undefined));
  this.gameTimer.timerCallback(this.phraseTime, this.endRound, this.context);
};

Game.prototype.startRound = function() {
  if(this.roundInProgress) {
    throw new Error(Err.ROUND_IN_PROGRESS);
  }

  this.roundInProgress = true;
  if(isGameOver()) {
    this.endGame();
  } else if(this.currentRound===0) {
    this.playerPool.broadcast(MsgGen.generateGamestatusMsg('firstPhrase', undefined, undefined));
    this.gameTimer.timerCallback(this.phraseTime, this.endRound, this.context);
  } else if(this.currentRound%2===0) {
    // Do phrase round
    this.gameTimer.timerCallback(this.phraseTime, this.endRound, this.context);
  } else {
    // Do draw round
    this.gameTimer.timerCallback(this.drawTime, this.endRound, this.context);
  }
  currentRound++;
};

Game.prototype.storePhraseDataAndStartRound = function(bookId, phrase) {
  if(this.roundInProgress) {
    throw new Error(Err.ROUND_IN_PROGRESS);
  }
  if(this.currentRound%2 !== 0) {
    throw new Error(Err.WRONG_DATA_SEND);
  }
  
  // Store data and start next round if needed
  if(++this.dataCollectionCount === this.playerPool.getSize()){
    this.dataCollectionCount = 0;
    this.startRound();
  }
};

Game.prototype.storeDrawDataAndStartRound = function(bookId, canvas) {
  // Store data and start next round
  if(this.roundInProgress) {
    throw new Error(Err.ROUND_IN_PROGRESS);
  }
  if(this.currentRound%2 !== 1) {
    throw new Error(Err.WRONG_DATA_SEND);
  }

  // Store data and start next round if needed
  if(++this.dataCollectionCount === this.playerPool.getSize()){
    this.dataCollectionCount = 0;
    this.startRound();
  }
};

Game.prototype.endRound = function(context) {
  context.roundInProgress = false; // Will need to use context for callback
  // Send some message requesting data
  context.playerPool.broadcast(MsgGen.generateGamestatusMsg('expectData', undefined, undefined));
};

Game.prototype.sendRoundData = function(typeName) {
  var bookIds = this.playerPool.getPlayerIds();
  var numPlayers = this.playerPool.getSize();
  var roundType = this.currentRound%2===0 ? 'phrase' : 'draw';
  // Sends round data with appropriate bookid
  for(var i=0;i<numPlayers;i++) {
    var bookId = bookIds[(numPlayers+currentRound)%numPlayers];
    var data = this.currentRound%2===0 ? this.books[bookId].getNewestPhrase() : this.books[bookId].getNewestCanvas();
    this.playerPool.playerPool[i].sendMessage(MsgGen.generateGamestatusMsg(
                                               roundType, 
                                               bookId,
                                               data
                                             ));
  }
};

module.exports = Game;