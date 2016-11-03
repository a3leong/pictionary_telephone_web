describe("GameManagerTests", function() {
  var GameManager = require('../node_classes/gamemanager');
  var Config = require('../config');
  var Err = require('../node_classes/errmsg');
  var gameManager;
  var fakePool;
  var phraseTime = Config.defaultPhraseTime;
  var drawTime = Config.defaultDrawTime;

  beforeEach(function() {
    gameManager = new GameManager();
    fakePool = jasmine.createSpy("fakepool");
    fakePool.playerPool = [];
    fakePool.closeSockets = function() {};
    fakePool.getSize = function() { return this.playerPool.length; };
    for(var i=0;i<Config.maxPlayers;i++) {
      fakePool.playerPool.push(i);
    }

  });

  it("Should be able to make games with unique ids",function() {
    var idList = {};
    for(var i=0;i<1000;i++) {
      var newId = gameManager.createGame(fakePool, phraseTime, drawTime);
      expect(idList[newId]).toBeFalsy(); // Check if it already exists
      idList[newId] = true; // If it doesn't fail expect we do this
    }
  });

  it("Should be able to create a game", function() {
    var id = gameManager.createGame(fakePool, phraseTime, drawTime);
    expect(gameManager.containsGame(id)).toBeTruthy();
  });

  it("Should throw an error trying to create game with too many or too little players", function(){
    var testPool = jasmine.createSpy("fakepool");
    testPool.playerPool = [];
    testPool.getSize = function() { return this.playerPool.length; };

    // Test too little players
    expect(function(){ 
      gameManager.createGame(testPool, phraseTime, drawTime);
    }).toThrowError(Err.NOT_ENOUGH_PLAYERS);
    // Test too many players
    for(var i=0;i<=Config.maxPlayers;i++) {
      testPool.playerPool.push(i);
    }
    expect(function(){ 
      gameManager.createGame(testPool, phraseTime, drawTime);
    }).toThrowError(Err.TOO_MANY_PLAYERS);
  });

  it("Should throw an error trying to create game with invalid times", function(){
    expect(function(){ 
      gameManager.createGame(fakePool, Config.maxPhraseTime+1, drawTime);
    }).toThrowError(Err.CREATE_GAME_PHRASE_TIME);

    expect(function(){ 
      gameManager.createGame(fakePool, Config.minPhraseTime-1, drawTime);
    }).toThrowError(Err.CREATE_GAME_PHRASE_TIME);

    expect(function(){ 
      gameManager.createGame(fakePool, phraseTime, Config.maxDrawTime+1);
    }).toThrowError(Err.CREATE_GAME_DRAW_TIME);

    expect(function(){ 
      gameManager.createGame(fakePool, phraseTime, Config.minDrawTime-1);
    }).toThrowError(Err.CREATE_GAME_DRAW_TIME);
  });

  it("Should be able to remove a game, throws error if doesn't exist", function() {
    var id = gameManager.createGame(fakePool, phraseTime, drawTime);
    gameManager.destroyGame(id); // Set to null or undefined
    expect(gameManager.containsGame(id)).toBeFalsy();
    expect(function(){gameManager.destroyGame(id);}).toThrowError(Err.GAME_DNE);
  });

  it("Should throw an error trying to store data in a nonexistant game", function() {
    var id = gameManager.createGame(fakePool, phraseTime, drawTime);
    expect(function(){gameManager.storePhraseData("nottheid", "dummymsg");}).toThrowError(Err.GAME_DNE); 
    expect(function(){gameManager.storeDrawData("nottheid", "dummymsg");}).toThrowError(Err.GAME_DNE); 
  });

  it("Should throw an error trying to start a nonexistant game", function() {
    var id = gameManager.createGame(fakePool, phraseTime, drawTime);
    expect(function(){gameManager.startGame("nottheid");}).toThrowError(Err.GAME_DNE); 
  });

  it("Should throw an error trying to get a playerpool from a nonexistant game", function() {
    var id = gameManager.createGame(fakePool, phraseTime, drawTime);
    expect(function(){gameManager.getPlayerPool("nottheid");}).toThrowError(Err.GAME_DNE); 
  });
});