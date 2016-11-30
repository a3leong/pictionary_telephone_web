# REST API
### Create Room: /api/createroom
GET http request which creates a room and returns a string id to the room.

# JSON Messages
All javascript objects are stringified and parsed using JavaScript's JSON standard object functions and follow the format:
>{
    type: "type_string",
    data: {
          }
 }

Type: The string value of the message to be receieved which should be used to determine how to handle the message receieved.
Data: A nested JSON object whose attributes depend on the type of message receieved.

The following information contains the type attribute along with a description and attributes for the data JSON object.

## Server to Client
### 'config'
#### Description
Sent by a lobby/room whenever anything is modified. Broadcasted to all players.
#### Fields
- gameId: The id of the game, probably not needed but included anyway
- playerCount: The number of players in the game
- phraseRoundTime: The current set time given for players to type in a phrase
- drawRoundTime: The current set time given for players to draw a phrase

### 'gamestatus'
#### Description
Sent by a game instance whenever it is necessary to let the client know when to change states or send information.
#### Fields
- status: 'firstPhrase' | 'phrase' | 'draw' | 'end' | 'expectData' (expectData means waiting for clients to send canvas/word data)
- bookId: The book id the user is adding a page to (owner of the book is the book's id) NOTE: May become deprecated since mgith not be necessary
- data: Data from last added page of the bookId given. Either a string phrase or base64URL depending on phrase or draw round
- currentRound: Optional
- totalRounds: Optional

### 'timer'
#### Description
Broadcasted to all players in a game during a round to tell the clients how much time is left in the current round.
#### Fields
- timeLeft: Amount of time left in the round in seconds


### 'playerBook'
#### Description
Sent by a game instance at the end of the game containing all phrase and draw data in order.
#### Fields
- playerId: Player's id in case client did not save it
- book: A multi-typed array containing draw and phrase data in order of addition (SUBJECT TO CHANGE)


### 'error'
#### Description
Whenever an exception is thrown by the backend when handling a client message, the exception is messaged back to the client.
#### Fields
- errmsg: The error message thrown by the server

## Client to Server:
### 'joinGameInstance'
#### Description
Used to join a lobby/room. Will return an error message if the room is full or DNE or the player id already exists
#### Fields
- gameId: Id of the room to join (technically game client treats room and game as the same thing)
- playerId: Id of the player joining

### 'kickPlayer'
#### Description
Kick a player from a room. Returns an error message if the room does not contain the player, though the client
should not allow for that anyway.
#### Fields
- gameId: Id of the room to kick a player from (technically game client treats room and game as the same thing)
- playerId: Id of the player to kick

### 'updateConfigOption'
#### Description
Update the draw or phrase round time. Other game modifiers can be added here later.
#### Fields
- gameId: Game id to update config of
- drawRoundTime: New draw round time
- phraseRoundTime: New phrase round time

### 'startGameInstance'
#### Description
Start a game by changing it from a room into a game class instance and calling the start function on the new instance.
Returns an error message if the room does not exist (will also return the same error message if the game has also been already started).
#### Fields
- gameId: Id of the room to kick a player from (technically game client treats room and game as the same thing)

### 'phraseDataSend'
#### Description
Phrase data to send to the server. Will send error if game DNE/book id DNE (possible deprecation of bookId) or if it is
the wrong round to send phrase data.
#### Fields
- gameId: Id of the game to add the data to
- bookId: Book id to add data to (Possible future deprecation)
- phrase: String value of the phrase data

### 'drawDataSend'
#### Description
Canvase base64 URL data to send to the server. Will send error if game DNE/book id DNE (possible deprecation of bookId) or if it is
the wrong round to send phrase data.
#### Fields
- gameId: Id of the game to add the data to
- bookId: Book id to add data to (Possible future deprecation)
- canvas: URL base64 encoded canvas to be stored
