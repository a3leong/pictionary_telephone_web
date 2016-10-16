describe("GameRoomTests", function() {
  var Room = require('../node_classes/room');
  var Config = require('../config');
  var gameRoom
  beforeEach(function() {
    gameRoom = new Room(Config.defaultPhraseTime, Config.defaultDrawTime);
  });

  it("Is able to make a game room",function() {
    // Make game room http
    var  roomId = gameRoom.getId();
    expect(roomId).toBeTruthy();
  });

  it("Should be able to view the info of a room and set variables", function() {
    // Check for defaults
    expect(gameRoom.getPhraseTime()).toEqual(Config.defaultPhraseTime);
    expect(gameRoom.getDrawTime()).toEqual(Config.defaultDrawTime);

    gameRoom.setPhraseTime(gameRoom.getPhraseTime()+3);
    gameRoom.setDrawTime(gameRoom.getDrawTime()-3);
    expect(gameRoom.getPhraseTime()).toEqual(Config.defaultPhraseTime+3);
    expect(gameRoom.getDrawTime()).toEqual(Config.defaultDrawTime-3);
  });

  it("Should expect an error when setting variables outside of config boundaries", function() {
    expect(function(){gameRoom.setPhraseTime(Config.minPhraseTime-1);}).toThrow();
    expect(function(){gameRoom.setPhraseTime(Config.maxPhraseTime+1);}).toThrow();
    expect(function(){gameRoom.setDrawTime(Config.minDrawTime-1);}).toThrow();
    expect(function(){gameRoom.setDrawTime(Config.maxDrawTime+1);}).toThrow();
  });

  it("Should be able to add a player", function() {
    // TODO
  });

  it("Should be able to delete a player", function() {
    // TODO
  });

  it("Should be able to start a game instance", function() {
    // TODO
  });
});