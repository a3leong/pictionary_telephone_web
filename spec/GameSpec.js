describe("GameTests", function() {
  var Game = require('../node_classes/game');
  var Config = require('../config');
  var Err = require('../node_classes/errmsg');
  var game;
  beforeEach(function() {
    var spyPool = jasmine.CreateSpy("Spypool");
    spyPool.broadcast = function(){};
    game = new Game("someId",spyPool,Config.defaultPhraseTime, Config.defaultDrawTime);
  });

  it("Should be able to start the game and broadcast a message to players saying the game has started", function() {
    game.startGame();
  });

  it("Should be able to broadcast to players when the client should change views", function() {
    game.startRound();
  });

  it("Should be able to broadcast to players that the game is waiting on client data", function() {
    game.startGame();
  });

  it("Should throw an error when trying to send/store data when it is in the middle of a round ", function(){

  });

  it("Should throw an error when trying to start a game after is has already been started", function() {

  });

  it("Should throw an error when trying to call start round when a round is in progress", function() {
    
  });

});