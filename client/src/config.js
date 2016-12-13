let config = {};

config.BACKEND_PORT = 3001;


let types = {};

types.JOIN_GAME_INSTANCE = "joinGameInstance";
types.START_GAME_INSTANCE = "startGameInstance";
types.SEND_PHRASE_DATA = "phraseDataSend";

module.exports = {
  Config: config,
  Types: types,
}
