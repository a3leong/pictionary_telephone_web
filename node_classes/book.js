function Book() {
  this.pages = [];
}

Book.prototype.getPages = function() {
  return pages;
};

Book.prototype.addPage = function(data) {
  pages.push(data);
};

module.exports = Book;
