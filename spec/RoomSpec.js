describe("GameRoomTests", function() {
  var Room = require('../node_classes/room');
  var Config = require('../config');
  var Err = require('../node_classes/errmsg');
  var gameRoom;
  beforeEach(function() {
    gameRoom = new Room("testroom", Config.defaultPhraseTime, Config.defaultDrawTime);
  });

  it("Should be able to view the info of a room and set variables", function() {
    // Check for defaults
    expect(gameRoom.phraseTime).toEqual(Config.defaultPhraseTime);
    expect(gameRoom.drawTime).toEqual(Config.defaultDrawTime);

    gameRoom.setPhraseTime(gameRoom.phraseTime+3);
    gameRoom.setDrawTime(gameRoom.drawTime-3);
    expect(gameRoom.phraseTime).toEqual(Config.defaultPhraseTime+3);
    expect(gameRoom.drawTime).toEqual(Config.defaultDrawTime-3);
  });

  it("Should expect an error when setting variables outside of config boundaries", function() {
    expect(function(){gameRoom.setPhraseTime(Config.minPhraseTime-1);}).toThrowError(Err.SET_PHRASE_TIME_BOUND);
    expect(function(){gameRoom.setPhraseTime(Config.maxPhraseTime+1);}).toThrowError(Err.SET_PHRASE_TIME_BOUND);
    expect(function(){gameRoom.setDrawTime(Config.minDrawTime-1);}).toThrowError(Err.SET_DRAW_TIME_BOUND);
    expect(function(){gameRoom.setDrawTime(Config.maxDrawTime+1);}).toThrowError(Err.SET_DRAW_TIME_BOUND);
  });

  // Should be bubbled from palyerpool
  // it("Should be able to add a player, but throw error if player already exists and throw error if socket is the same", function() {
  //   var socketSpy = jasmine.createSpy("Socketspy");
  //   var socketSpy2 = jasmine.createSpy("Socketspy2");
  //   gameRoom.addPlayer(socketSpy,"Player1");
  //   expect(gameRoom.containsPlayer("Player1")).toBeTruthy();
  //   expect(function() {gameRoom.addPlayer(socketSpy2, "Player1");}).toThrowError(Err.PLAYER_ID_EXISTS);
  //   expect(function() {gameRoom.addPlayer(socketSpy, "Player2");}).toThrowError(Err.CONNECTION_EXISTS);
  // });

  // it("Should be able to remove a player, but throw error if DNE", function() {
  //   var socketSpy1 = jasmine.createSpy("Socketspy");
  //   socketSpy1.close = function(){};
  //   var socketSpy2 = jasmine.createSpy("Socketspy");
  //   socketSpy2.close = function(){};
  //   gameRoom.addPlayer(socketSpy1, "Player1");
  //   gameRoom.addPlayer(socketSpy2, "Player2");
  //   gameRoom.removePlayer("Player1");

  //   expect(gameRoom.containsPlayer("Player1")).toBeFalsy();
  //   expect(gameRoom.containsPlayer("Player2")).toBeTruthy();
  //   expect(function() {gameRoom.removePlayer("Player1");}).toThrowError(Err.PLAYER_ID_DNE);
  // });
});