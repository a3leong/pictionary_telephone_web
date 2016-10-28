var validator = require('validator');
var Err = require('./errmsg');

function Book() { // Id handled by game's book dictionary
  this.phrasePages = [];
  this.canvasPages = [];
}

Book.prototype.getNewestPhrase = function() {
  if(this.phrasePages.length===0) {
    throw new Error(Err.NO_PHRASE_DATA);
  }

  return this.phrasePages[this.phrasePages.length-1];
};

Book.prototype.getNewestCanvas = function() {
  if(this.canvasPages.length===0) {
    throw new Error(Err.NO_CANVAS_DATA);
  }

  return this.canvasPages[this.canvasPages.length-1];
};

Book.prototype.addPhrase = function(phrase) {
  this.phrasePages.push(phrase);
};

Book.prototype.addCanvas = function(canvas) {
  if(!validator.isDataURI(canvas)) {
    throw new Error(Err.INVALID_DATA_URI);
  }

  this.canvasPages.push(canvas);
};

Book.prototype.getPages = function() {
  var returnArray = [];
  for(var i=0;i<this.phrasePages.length;i++) { // Iterate through phrasepages because we know canvasPages is the same or less
    returnArray.push(this.phrasePages[i]);
    if(i < this.canvasPages.length) {
      returnArray.push(this.canvasPages[i]);
    }
  }
  return returnArray;
};

module.exports = Book;