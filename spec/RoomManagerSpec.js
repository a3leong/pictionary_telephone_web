describe("RoomManagerTests", function() {
  var Room = require('../node_classes/room');
  var RoomManager = require('../node_classes/roommanager');
  var Config = require('../config');
  var Err = require('../node_classes/errmsg');
  var gameRoom;
  beforeEach(function() {
    roomManager = new RoomManager();
  });

  it("Should be able to make unique game rooms",function() {
    var idList = {};
    for(var i=0;i<100;i++) {
      var newId = roomManager.createRoom();
      expect(idList[newId]).toBeFalsy(); // Check if it already exists
      idList[roomManager.createRoom()] = true; // If it doesn't fail expect we do this
    }
  });

  it("Should be able to remove a room, throws error if doesn't exist", function() {
    var id = roomManager.createRoom();
    roomManager.destroyRoom(id); // Set to null or undefined
    expect(roomManager.containsRoom(id)).toBeFalsy();
    expect(function(){roomManager.destroyRoom(id);}).toThrowError(Err.ROOM_DNE);
  });

  it("Should throw an error trying to add player from a nonexistant room", function() {
    var socketSpy = jasmine.createSpy("Socketspy");
    expect(function(){roomManager.addPlayer("nonexistantRoom", "fakePlayerId", socketSpy);}).toThrowError(Err.ROOM_DNE);
  });

  it("Should throw an error trying to remove player from nonexistant room", function() {
    expect(function(){roomManager.removePlayer("nonexistantRoom", "fakePlayerId");}).toThrowError(Err.ROOM_DNE);
  });

  it("Should throw an error trying to get a socketPool from a nonexistant room", function() {
    expect(function(){roomManager.getPlayerPool("nonexistantRoom");}).toThrowError(Err.ROOM_DNE);

  });
});