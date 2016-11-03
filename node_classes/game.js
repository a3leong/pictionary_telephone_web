var GameTimer = require('./gametimer');
var Book = require('./book');

function Game(id, playerPool, phraseTime, drawTime) {
  this.id = id;
  this.playerPool = playerPool;
  this.gameTimer = new GameTimer(this.playerPool);
  this.phraseTime = phraseTime;
  this.drawTime = drawTime;
  this.currentRound = 0;
  this.books = {};
  this.roundInProgress = false; // server-client synchronization
  this.gameStarted = false;     // server-client synchronization
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

Game.prototype.startRound = function() {
  if(isGameOver()) {
    this.endGame();
  } else if(this.currentRound%2===0) {
    // Do phrase round
  } else {
    // Do draw round
  }
  // TODO make sure startround cannot be invoked before timer ends

  currentRound++;
};

Game.prototype.storePhraseDataAndStartRound = function(bookId, phrase) {
  // Store data and start next round

  this.startRound();
};

Game.prototype.storeDrawDataAndStartRound = function(bookId, canvas) {
  // Store data and start next round

  this.startRound();
};

module.exports = Game;