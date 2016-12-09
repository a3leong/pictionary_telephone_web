// Use this to resolve redundant typing and code smell
module.exports = {
  generateConfigMsg: function(config) {
    return JSON.stringify(config);
  },

  generateGamestatusMsg: function(status, bookId, data){
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