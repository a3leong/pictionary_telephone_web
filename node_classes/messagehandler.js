// Just put everything through the message handler?
//var RoomManager = require('./roommanager');
//var GameManager = require('./gamemanager');
var Err = require('./errmsg');

function MessageHandler(roomManager, gameManager){
  this.roomManager = roomManager;
  this.gameManager = gameManager;
}

MessageHandler.prototype.handleMessage(message, wsSender) {
  var messageObject = JSON.jsonify(message);
  var type = messageObject.type;
  var data = messageObject.data;

  switch(type) {
    case 'createGameInstance':
      this.createRoom(wsSender);
      break;
    case 'joinGameInstance':
      this.addPlayerToRoom(data.gameId, data.playerId, wsSender);
      break;
    case 'updateConfigOption':
      this.updateRoomConfig(data.gameId, data.drawRoundTime, data.phraseRoundTime);
      break;
    case 'startGameInstance':
      this.convertRoomToGame(data.gameId);
      break;
    case 'phraseDataSend':
      this.storePhraseData(data.gameId, data.bookId, data.phrase);
      break;
    case 'drawDataSend':
      this.storeDrawData(data.gameId, data.bookId, data.canvas);
    default:
      throw new Error(Err.NO_SUCH_MESSAGE_TYPE);
  }
}

MessageHandler.prototype.createRoom = function(ws) {
  var roomId = this.roomManager.createRoom();
  var configObj = this.roomManager.getConfig(roomId).
  ws.sendMessage(JSON.stringify({
    type: 'config',
    data: configObj
  }));
};

MessageHandler.prototype.addPlayerToRoom = function(roomId, playerId, ws) {
  this.roomManager.addPlayer(roomId, playerId, ws);
};

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