module.exports = {
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

      var intervalId = setInterval(function(){
        console.log(remainingTime);
        if(--remainingTime <= 0) {
          clearInterval(intervalId);
          callback(context);
        }
        if(broadcast) { thisRef.sendRemainingTime(remainingTime); }
      },1000);
    };
  }
}