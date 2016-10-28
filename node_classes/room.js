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

Room.prototype.setPhraseTime = function(pTime) {
  if(pTime < Config.minPhraseTime || pTime > Config.maxPhraseTime) {
    throw new Error(Err.SET_PHASE_TIME_BOUND);
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
  this.playerPool.addPlayer(playerId, ws);
  // if(this.playerPool.size>=Config.maxPlayers) {
  //   throw new Error(Err.FULL_LOBBY);
  // }
  // stringId = playerId.toString();   // In case a number is passed somehow
  // if(this.playerPool.containsPlayerId(playerId)) {
  //   throw new Error(Err.PLAYER_ID_EXISTS);
  // } else if(this.playerPool.containsSocket(ws)) {
  //   throw new Error(Err.CONNECTION_EXISTS)
  // } else {
  //   this.playerPool.addPlayer(new Player(ws, stringId));
  // }
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