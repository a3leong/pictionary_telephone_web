module.exports = {
  SocketPool: function(socketArray) {
    this.socketPool = socketArray;

    this.addSocket = function(ws) {
      this.socketPool.push(ws);
    }

    this.closeSockets = function(ws) {
      for(ws in this.socketPool) {
        ws.close();
      }
    }

    this.broadcast = function(message) {
      for(var i=0;i<this.socketPool.length;i++) {
        this.socketPool[i].send(message);
      };
    }

    this.socketCount = function() {
      return this.socketPool.length;
    };
  },

  GameTimer: function(socketPool) {
    this.socketPool = socketPool;

    this.sendRemainingTime = function(remainingTime) {
      this.socketPool.broadcast(JSON.stringify({
        type: 'timer',
        data: { time_left: remainingTime }
      }));
    };

    this.timerCallback = function(timeInSeconds, callback, context, broadcast=true) {
      var thisRef = this; // To hold old self
      var remainingTime = timeInSeconds;

      var interval_id = setInterval(function(){
        console.log(remainingTime);
        if(--remainingTime <= 0) {
          clearInterval(interval_id);
          callback(context);
        }
        if(broadcast) { thisRef.sendRemainingTime(remainingTime); }
      },1000);
    };
  },

  GameInstance: function(gameId, playerSockets = []) {
    this.gameRunning = false;
    this.roundNumber = 0;
    this.gameId = gameId;
    this.playerSockets = new module.exports.SocketPool(playerSockets);
    this.GameTimer = new module.exports.GameTimer(this.playerSockets);
    this.drawRoundTime = 30;
    this.phraseRoundTime = 10;
    this.imageData = [];
    this.phraseData = [];  // TODO handle ordering on recieving
    this.context = this;

    this.getConfig = function() {
      // playerCount is the players id as well if it hasn't been set yet
      return {
        type: 'gamestate',
        data:{
          state: 'config',
          gameId: this.gameId,
          playerCount: this.getPlayerCount(),
          drawRoundTime: this.drawRoundTime,
          phraseRoundTime: this.phraseRoundTime
        } 
      };      
    }

    this.addPlayer = function(ws) {
      this.playerSockets.addSocket(ws);
      // Send all data because new player needs info, simpler to just resend to all
      this.sendMessage(JSON.stringify(this.getConfig()));
    };

    this.getPlayerCount = function() {
      return this.playerSockets.socketCount();
    };

    this.sendMessage = function(message) {
      this.playerSockets.broadcast(message);
    };

    this.sendGamestate = function(state, data = null) {
        this.sendMessage(JSON.stringify({
          type: "gamestate",
          data: data
        }));
    };

    this.sendSetupInfo = function() {
        this.sendMessage(JSON.stringify({
          type: "gamestate",
          state: "config",
          drawRoundTime: this.drawRoundTime,
          phraseRoundTime: this.phraseRoundTime
        }));
    };

    this.isGameOver = function() {
      if(this.roundNumber < this.getPlayerCount()) {
        return false;
      } else {
        return true;
      }
    }

    this.startGame = function(){
      this.gameRunning = true;
      this.updateGame(this.context);
    };

    this.updateGame = function(context){
      if(context.isGameOver()) {
        console.log(context.roundNumber);
        context.gameRunning = false;
        context.sendResults(context);
      }
      else {
        if((context.roundNumber++)%2==0){
          context.startPhraseRound(context);
        } else {
          context.startDrawRound(context);
        }
      }
    }

    this.startPhraseRound = function(context){
      // message.send(JSON.stringify({
      //   type: "gamestate",
      //   data: {state: "phrase"}
      // }));
      this.GameTimer.timerCallback(this.phraseRoundTime, this.updateGame, context, broadcast=true);
    };

    this.startDrawRound = function(context){
      // message.send(JSON.stringify({
      //   type: "gamestate",
      //   data: {state: "draw"}
      // }));
      this.GameTimer.timerCallback(this.drawRoundTime, this.updateGame, context, broadcast=true);
    };

    this.sendResults = function(context){
      console.log("Game over");
      // message.send(JSON.stringify({
      //   type: "gamestate",
      //   state: "results"
      // }));
      // // TODO: fix later
      // this.sendMessage(this.imageData);
    };
  }
}