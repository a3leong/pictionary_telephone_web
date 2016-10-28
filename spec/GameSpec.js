describe("GameTests", function() {
  var Game = require('../node_classes/game');
  var Config = require('../config');
  var Err = require('../node_classes/errmsg');
  var game;
  beforeEach(function() {
    var spyPool = jasmine.CreateSpy("Spypool");
    game = new Game("someId",spyPool,Config.defaultPhraseTime, Config.defaultDrawTime);
  });

  it("Should be able to start the game and broadcast a message to players saying the game has started", function() {
    game.startGame();
  });

  it("Should be able to broadcast to players when the client should change views", function() {
    game.startGame();
  });

  it("Should be able to broadcast to players that the game is waiting on client data", function() {
    game.startGame();
  });
});