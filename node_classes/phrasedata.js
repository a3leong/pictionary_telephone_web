function PhraseData(playerId, phrase) {
  this.playerId = playerId;        // playerId
  this.phrase = phrase;            // String
}

PhraseData.prototype.getPlayerId = function() {
  return this.playerId;
};

PhraseData.prototype.getPhrase = function() {
  return this.phrase;
};


module.exports = PhraseData;