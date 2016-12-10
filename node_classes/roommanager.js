var Room = require('./room');
var Err = require('./errmsg');
var Config = require('../config');

function RoomManager() {
  this.roomDictionary = {};
};

RoomManager.prototype.getPlayerPool = function(roomId) {
  if(!this.roomDictionary[roomId]) {
    throw new Error(Err.ROOM_DNE);
  }

  return this.roomDictionary[roomId].playerPool;
};

// To be deprecated
RoomManager.prototype.getConfig = function(roomId) {
  if(!this.roomDictionary[roomId]) {
    throw new Error(Err.ROOM_DNE);
  }

  return this.roomDictionary[roomId].getConfig();
};

RoomManager.prototype.createRoom = function() {
  var id = this.makeId();
  while(this.roomDictionary[id]) {
    id = this.makeId(); // Since we expect low amount of users, we just regen an id until we get a free one
  }
  this.roomDictionary[id] = new Room(id, Config.defaultPhraseTime, Config.defaultDrawTime);
  return id;
};

RoomManager.prototype.destroyRoom = function(roomId) {
  if(!this.roomDictionary[roomId]) {
    throw new Error(Err.ROOM_DNE);
  }

  this.roomDictionary[roomId] = null;
};

RoomManager.prototype.addPlayer = function(roomId, playerId, playerSocket) {
  if(!this.roomDictionary[roomId]) {
    throw new Error(Err.ROOM_DNE);
  }

  this.roomDictionary[roomId].addPlayer(playerId, playerSocket);
};

RoomManager.prototype.removePlayer = function(roomId, playerId) {
  if(!this.roomDictionary[roomId]) {
    throw new Error(Err.ROOM_DNE);
  }

  this.roomDictionary[roomId].removePlayer(playerId);
};

RoomManager.prototype.containsRoom = function(roomId) {
  if(this.roomDictionary[roomId]) {
    return true;
  } else {
    return false;
  }
};

// http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
RoomManager.prototype.makeId = function()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

module.exports = RoomManager;