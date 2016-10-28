var Game = require('./game');
var Err = require('./errmsg');
var Config = require("../config");

function GameManager() {
  this.gameDictionary = {};
}

GameManager.prototype.getPlayerPool = function(id) {
  if(this.gameDictionary[id]) {
    return this.gameDictionary[id].getPlayerPool();
  } else {
    throw new Error(Err.GAME_DNE);
  }
};

GameManager.prototype.createGame = function(playerPool, phraseTime, drawTime) {
  if(playerPool.getSize() < Config.minPlayers) {
    //throw new Error(Err.NOT_ENOUGH_PLAYERS+": " + playerPool.getSize());
    throw new Error(Err.NOT_ENOUGH_PLAYERS);
  }
  if(playerPool.getSize() > Config.maxPlayers) {
    //throw new Error(Err.TOO_MANY_PLAYERS + ": " + playerPool.getSize());
    throw new Error(Err.TOO_MANY_PLAYERS);
  }
  if(phraseTime < Config.minPhraseTime || phraseTime > Config.maxPhraseTime) {
    throw new Error(Err.CREATE_GAME_PHRASE_TIME);
  }
  if(drawTime < Config.minDrawTime || drawTime > Config.maxDrawTime) {
    throw new Error(Err.CREATE_GAME_DRAW_TIME);
  }

  var id = this.makeId();
  while(this.gameDictionary[id]) {
    id = this.makeId(); // Since we expect low amount of users, we just regen an id until we getConfig a free one
  }
  this.gameDictionary[id] = new Game(id, playerPool, phraseTime, drawTime);
  return id;
};

GameManager.prototype.destroyGame = function(id) {
  if(this.gameDictionary[id]) {
   this.gameDictionary[id].closeSockets();
   this.gameDictionary[id] = null;
  } else {
   throw new Error(Err.GAME_DNE);
  }
};

GameManager.prototype.startGame = function(id) {
  if(this.gameDictionary[id]) {
    this.gameDictionary[id].startGame();
  } else {
    throw new Error(Err.GAME_DNE);
  }
};

GameManager.prototype.sendMessage = function(gameId, msg) {
  if(this.gameDictionary[gameId]) {
    this.gameDictionary[gameId].handleMessage(msg);
  } else {
    throw new Error(Err.GAME_DNE);
  }
};

GameManager.prototype.containsGame = function(id) {
  if(this.gameDictionary[id])
    return true;
  else
    return false;
};

// http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
GameManager.prototype.makeId = function()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

module.exports = GameManager;