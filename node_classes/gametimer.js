var MsgGen = require('./messagegenerator')


function GameTimer(socketPool) {
  this.socketPool = socketPool;
}

GameTimer.prototype.sendRemainingTime = function(remainingTime) {
  this.socketPool.broadcast(MsgGen.generateTimerMsg(remainingTime));
};

GameTimer.prototype.timerCallback = function(timeInSeconds, callback, context, broadcast=true) {
  var thisRef = this; // To hold old self
    var remainingTime = timeInSeconds;

  var intervalId = setInterval(function(){
    console.log(remainingTime);
    if(--remainingTime < 0) {
      clearInterval(intervalId);
      callback(context);
    }
    if(broadcast && remainingTime>=0) { thisRef.sendRemainingTime(remainingTime); }
    },1000);
};


module.exports = GameTimer;