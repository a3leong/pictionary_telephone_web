var Config = require('../config');
var Player = require('./player');
var PlayerPool = require('./playerpool');
var Err = require('./errmsg');

/**
 * Room() is a class used to handle players joining and prepping for a game.
 * The parameters are then to be sent to the gameinstance class
 **/
 function Room(phraseTime, drawTime) {   // Pass it config file defaults
  this.phraseTime = phraseTime;
  this.drawTime = drawTime;
  this.playerPool = new PlayerPool();
  this.roomId = this.makeId();

 }

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

Room.prototype.getPhraseTime = function() {
  return this.phraseTime;
};

Room.prototype.getDrawTime = function() {
  return this.drawTime;
};

// Returns false if player already exists
Room.prototype.addPlayer = function(ws, playerId) {
  if(this.playerPool.size>=Config.maxPlayers) {
    throw new Error(Err.FULL_LOBBY);
  }
  stringId = playerId.toString();   // In case a number is passed somehow
  if(this.playerPool.containsPlayerId(playerId)) {
    throw new Error(Err.PLAYER_ID_EXISTS);
  } else if(this.playerPool.containsSocket(ws)) {
    throw new Error(Err.CONNECTION_EXISTS)
  } else {
    this.playerPool.addPlayer(new Player(ws, stringId));
  }
};

Room.prototype.containsPlayer = function(playerId) {
  return this.playerPool.containsPlayerId(playerId);
};

Room.prototype.getPlayerIds = function() {
  return this.playerPool.getPlayerIds();
};


Room.prototype.removePlayer = function(playerId) {
  if(!this.playerPool.removePlayer(playerId)) {
    throw new Error(Err.PLAYER_ID_DNE);
    console.log(this.playerPool.getPlayerIds());
  }
};

Room.prototype.getId = function() {
  return this.roomId;
};

// http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
Room.prototype.makeId = function()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};


module.exports = Room;