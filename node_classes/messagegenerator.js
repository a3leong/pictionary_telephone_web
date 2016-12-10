// Use this to resolve redundant typing and code smell
module.exports = {
  generateConfigMsg: function(gameId, playerCount, playerIds, phraseTime, drawTime){
    return JSON.stringify({
      type: 'config',
      data: {
        gameId: gameId,
        playerCount: playerCount,
        playerIds: playerIds,
        phraseRoundTime: phraseTime,
        drawRoundTime: drawTime
      }
    });
  },

  generateGameStatusMsg: function(status, bookId, data){
    return JSON.stringify({
      type: 'gamestatus',
      data: {
        status: status,
        bookId: bookId,
        data: data
      }
    });
  },

  generateTimerMsg: function(timeLeft) {
    return JSON.stringify({
      type: 'timer',
      data: {
        timeLeft: timeLeft
      }
    });
  },

  generateBookMsg: function(playerId, book) {
    return JSON.stringify({
      type: 'playerBook',
      data: {
        playerId: playerId,
        book: book
      }
    });
  },

  generateErrorMsg: function(err) {
    return JSON.stringify({
      type: 'error',
      data: {
        errmsg: err
      }
    });
  }
};