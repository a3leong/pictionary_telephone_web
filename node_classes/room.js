var Config = require('../config');

/**
 * Room() is a class used to handle players joining and prepping for a game.
 * The parameters are then to be sent to the gameinstance class
 **/
 function Room(phraseTime, drawTime) {   // Pass it config file defaults
  this.phraseTime = phraseTime;
  this.drawTime = drawTime;
  this.players = []; // Stores player ids
  this.roomId = this.makeId();

 }

 Room.prototype.setPhraseTime = function(pTime) {
  if(pTime < Config.minPhraseTime || pTime > Config.maxPhraseTime) {
    throw new Error("Phrase time out of boundaries");
  }
  this.phraseTime = pTime;
 };

 Room.prototype.setDrawTime = function(dTime) {
  if(dTime < Config.minDrawTime || dTime > Config.maxDrawTime) {
    throw new Error("Draw time out of boundaries");
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
Room.prototype.addPlayer = function(playerId) {
  stringId = playerId.toString();   // In case a number is passed somehow
  if(this.players.indexOf(stringId) != -1) {
    return false;
  } else {
    this.players.push(stringId);
    return true;
  }
};

Room.prototype.removePlayer = function(playerId) {
  var i = this.players.indexOf(playerId.toString());  // In case a number is passed somehow
  if(i != -1) {
    return false;
  } else {
    this.players.splice(i, 1);
    return true;
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