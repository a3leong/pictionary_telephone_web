// Just put everything through the message handler?
//var RoomManager = require('./roommanager');
//var GameManager = require('./gamemanager');
var Err = require('./errmsg');

function MessageHandler(roomManager, gameManager){
  this.roomManager = roomManager;
  this.gameManager = gameManager;
}

MessageHandler.prototype.handleMessage = function(message, wsSender) {
  var messageObject = JSON.parse(message);
  var type = messageObject.type;
  var data = messageObject.data;

  switch(type) {
    case 'createGameInstance':
      console.log("Create game");
      // this.createRoom(wsSender);
      break;
    case 'joinGameInstance':
      console.log("Join game");
      this.addPlayerToRoom(data.gameId, data.playerId, wsSender);
      break;
    case 'kickPlayer':
      console.log("Kick palyer");
      this.removePlayerFromRoom(data.gameId, data.playerId);
    case 'updateConfigOption':
      console.log("Update config");
      // this.updateRoomConfig(data.gameId, data.drawRoundTime, data.phraseRoundTime);
      break;
    case 'startGameInstance':
      console.log("Start game instance");
      // this.convertRoomToGame(data.gameId);
      break;
    case 'phraseDataSend':
      console.log("Phrase data send");
      // this.storePhraseData(data.gameId, data.bookId, data.phrase);
      break;
    case 'drawDataSend':
      console.log("draw data send");
      // this.storeDrawData(data.gameId, data.bookId, data.canvas);
    default:
      throw new Error(Err.NO_SUCH_MESSAGE_TYPE);
  }
}

MessageHandler.prototype.createRoom = function() {
  return this.roomManager.createRoom();
};

MessageHandler.prototype.addPlayerToRoom = function(roomId, playerId, ws) {
  this.roomManager.addPlayer(roomId, playerId, ws);
};

MessageHandler.prototype.removePlayerFromRoom = function(roomId, playerId) {
  this.roomManager.removePlayer(roomId, playerId);
}

MessageHandler.prototype.convertRoomToGame = function(roomId) {
  var playerPool = this.roomManager.getPlayerPool(roomId);
  var configObj = this.roomManager.getConfig(roomId);
  this.roomManager.destroyRoom(roomId);
  var gameId = this.gameManager.createGame(playerPool, configObj.phraseRoundTime, configObj.drawRoundTime);
  this.gameManager.startGame(gameId);
};

MessageHandler.prototype.storePhraseData = function(gameId, bookId, phrase) {
  this.gameManager.storePhraseData(gameId, bookId, phrase);
};

MessageHandler.prototype.storeDrawData = function(gameId, bookId, canvas) {
  this.gameManager.storeDrawData(gameId, bookId, canvas);
};

module.exports = MessageHandler;