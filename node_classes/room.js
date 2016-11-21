var Config = require('../config');
// var Player = require('./player');
var PlayerPool = require('./playerpool');
var Err = require('./errmsg');
var Validator = require('validator');

/**
 * Room() is a class used to handle players joining and prepping for a game.
 * The parameters are then to be sent to the gameinstance class
 **/
function Room(id, phraseTime, drawTime) {   // Pass it config file defaults
  this.phraseTime = phraseTime;
  this.drawTime = drawTime;
  this.playerPool = new PlayerPool();
  this.id = id;

}

Room.prototype.getPlayerIds = function() {
  return this.playerPool.getPlayerIds();
};

Room.prototype.getConfig = function() {
  return {
    type: 'config',
    data: {
      gameId: this.id,
      playerCount: this.playerPool.getSize(),
      playerIds: this.playerPool.getPlayerIds(),
      phraseRoundTime: this.phraseTime,
      drawRoundTime: this.drawTime
    }
  };
};

Room.prototype.setPhraseTime = function(pTime) {
  if(pTime < Config.minPhraseTime || pTime > Config.maxPhraseTime) {
    throw new Error(Err.SET_PHRASE_TIME_BOUND);
  }
  this.phraseTime = pTime;
};

Room.prototype.setDrawTime = function(dTime) {
  if(dTime < Config.minDrawTime || dTime > Config.maxDrawTime) {
    throw new Error(Err.SET_DRAW_TIME_BOUND);
  }
  this.drawTime = dTime;
};

// Throw error on existing
Room.prototype.addPlayer = function(playerId, ws) {
  console.log("Add player");
  this.playerPool.addPlayer(playerId, ws);
  this.playerPool.broadcast(JSON.stringify(this.getConfig()));
};

Room.prototype.closeSockets = function() {
  this.playerPool.closeSockets();
};

Room.prototype.removePlayer = function(playerId) {
  this.playerPool.removePlayer(playerId);
};

Room.prototype.containsPlayer = function(playerId) {
  return this.playerPool.containsPlayerId(playerId);
};

module.exports = Room;