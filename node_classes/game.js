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
  console.log(this.playerPool.getPlayerIds());
  console.log("Game created: " + this.id + " phraseTime: " + this.drawTime);
}

Game.prototype.closeSockets = function() {
  this.playerPool.closeSockets();
};

Game.prototype.initBooks = function() {
  var pids = this.playerPool.getPlayerIds();
  for(var i=0;i<pids.length;i++) {
    console.log("New book: " + pids[i]);
    this.books[pids[i]] = new Book();
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
  this.initBooks();
  this.startRound();
};

Game.prototype.startRound = function() {
  if(this.roundInProgress) {
    throw new Error(Err.ROUND_IN_PROGRESS);
  }

  this.roundInProgress = true;
  if(this.isGameOver()) {
    this.endGame();
  } else if(this.currentRound===0) {
    this.sendRoundData('firstPhrase', this.phraseTime);
    this.gameTimer.timerCallback(this.phraseTime, this.endRound, this.context);
  } else if(this.currentRound%2===0) {
    // Do phrase round
    this.sendRoundData('phrase', this.phraseTime);
    this.gameTimer.timerCallback(this.phraseTime, this.endRound, this.context);
  } else {
    // Do draw round
    this.sendRoundData('draw', this.drawTime);
    this.gameTimer.timerCallback(this.drawTime, this.endRound, this.context);
  }
  this.currentRound++;
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
  context.playerPool.broadcast(MsgGen.generateGamestatusMsg('expectData', context.gameId, null, null));
};

Game.prototype.sendRoundData = function(roundType, roundTime) {
  var bookIds = this.playerPool.getPlayerIds();
  var numPlayers = this.playerPool.getSize();
  // Sends round data with appropriate bookid
  for(var i=0;i<numPlayers;i++) {
    var bookId = bookIds[(numPlayers+this.currentRound)%numPlayers];
    var data;
    if(this.currentRound===0) {
      data = null;
    } else {
      data = this.currentRound%2===0 ? this.books[bookId].getNewestPhrase() : this.books[bookId].getNewestCanvas();
    }
    this.playerPool.playerPool[i].sendMessage(MsgGen.generateGamestatusMsg(
                                               roundType,
                                               this.id,
                                               bookId,
                                               data,
                                               roundTime
                                             ));
    console.log("Send bookid: " + bookId);
  }
};

module.exports = Game;