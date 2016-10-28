describe("GameTests", function() {
  var Book = require('../node_classes/book');
  var Config = require('../config');
  var Err = require('../node_classes/errmsg');
  var book;
  beforeEach(function() {
    book = new Book();
  });

  it("Should throw an error trying to get latest phrase data when none added", function(){
    expect(function(){book.getNewestPhrase();}).toThrowError(Err.NO_PHRASE_DATA);
  });

  it("Should throw an error trying to get latest canvas data when none added", function(){
    expect(function(){book.getNewestCanvas();}).toThrowError(Err.NO_CANVAS_DATA);
  });

  it("Should be add a phrase and be able to retrieve the latest one", function() {
    book.addPhrase("Hello world");
    expect(book.getNewestPhrase()).toEqual("Hello world");
    book.addPhrase("Hello world2");
    expect(book.getNewestPhrase()).not.toEqual("Hello world");
    expect(book.getNewestPhrase()).toEqual("Hello world2");
  });

  it("Should be able to add a base64 canvas data url", function() {
    var validURI = "data:image/gif;base64,R0lGODdhMAAwAPAAAAAAAP///ywAAAAAMAAw AAAC8IyPqcvt3wCcDkiLc7C0qwyGHhSWpjQu5yqmCYsapyuvUUlvONmOZtfzgFz ByTB10QgxOR0TqBQejhRNzOfkVJ+5YiUqrXF5Y5lKh/DeuNcP5yLWGsEbtLiOSp a/TPg7JpJHxyendzWTBfX0cxOnKPjgBzi4diinWGdkF8kjdfnycQZXZeYGejmJl ZeGl9i2icVqaNVailT6F5iJ90m6mvuTS4OK05M0vDk0Q4XUtwvKOzrcd3iq9uis F81M1OIcR7lEewwcLp7tuNNkM3uNna3F2JQFo97Vriy/Xl4/f1cf5VWzXyym7PH hhx4dbgYKAAA7";
    book.addCanvas(validURI);
    expect(book.getNewestCanvas()).toEqual(validURI);
  });

  it("Should throw an error trying to add a nonvalid data uri to canvas data", function() {
    var notValidURI = "hi I am not valid";
    expect(function(){book.addCanvas(notValidURI);}).toThrowError(Err.INVALID_DATA_URI)
  });

  it("Should be able to create an array of a mix of phrase and canvas data data", function() {
    var validURI = "data:image/gif;base64,R0lGODdhMAAwAPAAAAAAAP///ywAAAAAMAAw AAAC8IyPqcvt3wCcDkiLc7C0qwyGHhSWpjQu5yqmCYsapyuvUUlvONmOZtfzgFz ByTB10QgxOR0TqBQejhRNzOfkVJ+5YiUqrXF5Y5lKh/DeuNcP5yLWGsEbtLiOSp a/TPg7JpJHxyendzWTBfX0cxOnKPjgBzi4diinWGdkF8kjdfnycQZXZeYGejmJl ZeGl9i2icVqaNVailT6F5iJ90m6mvuTS4OK05M0vDk0Q4XUtwvKOzrcd3iq9uis F81M1OIcR7lEewwcLp7tuNNkM3uNna3F2JQFo97Vriy/Xl4/f1cf5VWzXyym7PH hhx4dbgYKAAA7";
    var phrase = "Hello World";

    for(var i=0;i<10;i++) {
      if(i%2==0) {
        book.addPhrase(phrase);
      } else {
        book.addCanvas(validURI);
      }
    }
    var bookOutput = book.getPages();
    for(var i=0;i<10;i++) {
      if(i%2==0) {
        expect(bookOutput[i]).toEqual(phrase);
      } else {
        expect(bookOutput[i]).toEqual(validURI);
      }
    }


    book2 = new Book();
    for(var i=0;i<11;i++) {
      if(i%2==0) {
        book2.addPhrase(phrase);
      } else {
        book2.addCanvas(validURI);
      }
    }
    var bookOutput = book2.getPages();
    for(var i=0;i<11;i++) {
      if(i%2==0) {
        expect(bookOutput[i]).toEqual(phrase);
      } else {
        expect(bookOutput[i]).toEqual(validURI);
      }
    }
  });
});