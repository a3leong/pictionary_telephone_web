var Room = require('./room');
var Err = require('./errmsg');
var Config = require('../config');

function RoomManager() {
  this.roomDictionary = {};
};

RoomManager.prototype.getPlayerPool = function(roomId) {
  if(this.roomDictionary[roomId]) {
    return this.roomDictionary[roomId].playerPool;
  } else {
    throw new Error(Err.ROOM_DNE);
  }
};

RoomManager.prototype.createRoom = function() {
  var id = this.makeId();
  while(this.roomDictionary[id]) {
    id = this.makeId(); // Since we expect low amount of users, we just regen an id until we getConfig a free one
  }
  this.roomDictionary[id] = new Room(id, Config.defaultPhraseTime, Config.defaultDrawTime);
  return id;
};

RoomManager.prototype.destroyRoom = function(roomId) {
  if(this.roomDictionary[roomId]) {
    this.roomDictionary[roomId].closeSockets();
    this.roomDictionary[roomId] = null;
  } else {
    throw new Error(Err.ROOM_DNE);
  }
};

RoomManager.prototype.addPlayer = function(roomId, playerId, playerSocket) {
  if(this.roomDictionary[roomId]) {
    this.roomDictionary[roomId].addPlayer(playerId, playerSocket);
  } else {
    throw new Error(Err.ROOM_DNE);
  }
};

RoomManager.prototype.removePlayer = function(roomId, playerId) {
  if(this.roomDictionary[roomId]) {
    this.roomDictionary[roomId].removePlayer(playerId);
  } else {
    throw new Error(Err.ROOM_DNE);
  }
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