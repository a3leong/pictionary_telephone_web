# Game Flow
Alright, here is a hopefully brief example of how the client and server should interact in a game without any errors occuring.
We will keep the example simple and only have 2 players in the game. Also, instead of writing a super long base64 canvas URL, we will use 
the phrase "picture_data" instead.
Player and client will be used interchangably, but should essentially mean the same thing.


## Game lobby/room creation and adding players
To start, one of the clients will start a game in their web browser.
This results in a REST API call to the only function available: creategame.
The following url should be requested: www.somedomain.com/api/createroom
which will return a string representing the id of the room, the client will then
automatically create a websocket connection to the server and upon connection send a message
to join the room (using the id of the room we just received). We will also send a username within
the data payload of the message.

#### Client to server
{
  type: 'joinGameInstance'
  data: {
    gameId: 'okje34',
    playerId: 'player1'  
  }
}


In turn, the server will add the player to the specified room and
return a config message to all players that are in the room
(including the player who just joined).

#### Server to client
{
  type: 'config'
  data: {
    gameId: 'okje34',
    playerCount: 1,
    playerIds: ['player1'],
    phraseRoundTime: 10,
    drawRoundTime: 30
  }
}

Let's also add another player to this room, with the id player2. This results
in the following interaction.

#### Client to server
{
  type: 'joinGameInstance'
  data: {
    gameId: 'okje34',
    playerId: 'player2'  
  }
}

#### Server to both clients
{
  type: 'config'
  data: {
    gameId: 'okje34',
    playerCount: 2,
    playerIds: ['player1', 'player2'],
    phraseRoundTime: 10,
    drawRoundTime: 30
  }
}

## Modifying game parameters

Now let's say player1 and player2 agree that they are both slow
thinkers and need more time to come up with a phrase. Either player1
or player2 would then update the value on their client, which would send
a message to the server:

#### Client to server
{
  type: 'updateConfigOption'
  data {
    gameId: 'okje34'
    phraseRoundTime: 15,
    drawRoundTime: 30
  }
}

#### Server response to all clients
type: 'config'
  data: {
    gameId: 'okje34',
    playerCount: 2,
    playerIds: ['player1', 'player2'],
    phraseRoundTime: 15,
    drawRoundTime: 30
  }
}

Technically both the phrase and draw time can be updated at once using messages,
but for ease of use, we can just have the client send the message to the server
whenever one of the values is changed in the DOM. (Ideally though we'd want to make
it so just a room creator can do this)

## Removing a player

Now suppose a third player joined the game, but player1 and player2 aren't really 
fond of him/her. Either player1 and player2 can boot them from the room
(Ideally though we'd want to make it so just a room creator can do this).

#### Client to server
{
  type: 'joinGameInstance'
  data: {
    gameId: 'okje34',
    playerId: 'player3'  
  }
}

#### Server to all clients
{
  type: 'config'
  data: {
    gameId: 'okje34',
    playerCount: 3,
    playerIds: ['player1', 'player2', 'player3'],
    phraseRoundTime: 15,
    drawRoundTime: 30
  }
}

#### Client to server
{
  type: 'kickPlayer'
  data: {
    gameId: 'okje34',
    playerId: 'player3'  
  }
}

#### Server to all clients (not player3 cause booted)
{
  type: 'config'
  data: {
    gameId: 'okje34',
    playerCount: 2,
    playerIds: ['player1', 'player2'],
    phraseRoundTime: 15,
    drawRoundTime: 30
  }
}

## Starting the game
To start the game, the player would click a button on the browser that
would then cause the client to send a message to the server

#### Client to the server
{
  type: 'startGameInstance'
  data: {
    gameId: 'okje34',
  }
}

## First round
The first round of the game is the same as every phrase round,
but is unique in that the client needs to know that there is no image
to display since the game has no submitted data yet. The UI should also
look different as response to this.



#### Server to player1
{
  type: 'gamestatus'
  data: {
    status: 'firstPhrase',
    bookId: 'player1',
    data: null,
  }
}

#### Server to player2
{
  type: 'gamestatus'
  data: {
    status: 'firstPhrase',
    bookId: 'player2',
    data: null,
  }
}

The messages should be unique to every player for each round because
the bookId should be the book they are currently going to be writing to.
Since this is the firstphrase, the players should be getting their own books
in order to start off the first page. There is more to a round, but to avoid
redundancy, we will discuss the other parts of a round in the following sections.

## Phrase round
The 1st and all other odd numbered rounds of the game are phrase rounds.
In a typical phrase round, a player will receieve draw data and a bookId
for the player's book they are writing to like this:

#### Server to player1
{
  type: 'gamestatus'
  data: {
    status: 'firstPhrase',
    bookId: 'player2',
    data: 'picture_data',
  }
}

#### Server to player2
{
  type: 'gamestatus'
  data: {
    status: 'firstPhrase',
    bookId: 'player1',
    data: 'picture_data',
  }
}


Note: The picture data should be scaled by the previous client, and should be scaled
from some agreed upon dimensions to fit the canvas
bookId does not need to be used by the client until sending a message with
the phrase data to the server. It is only used to tell the server which
book the data should be stored in.

After this message, the server will send timer messages to all clients
in 1 second intervals declaring how much time is left for the round.

#### Server to all clients
{
  type: 'timer',
  data: {
    timeLeft: 15
  }
}

#### Server to all clients
{
  type: 'timer',
  data: {
    timeLeft: 14
  }
}

etc...

After the timer reaches 0, a different message is sent

#### Server to all clients
{
  type: 'gamestatus',
  data: {
    status: 'expectData'
  }
}

This should cause the client to automatically respond with the
following message (thereby sending whatever the user has written
regardless whether they considered themselves to have finished or not).
In this case, let's send the phraseData as if we had just finished the
first round of the game (the first phrase)

#### player1 to server
{
  type: 'phraseDataSend'
  data: {
    gameId: 'okje34'
    bookId: 'player1'
    phrase: 'camel'
  }
}

#### player2 to server
{
  type: 'phraseDataSend'
  data: {
    gameId: 'okje34'
    bookId: 'player2'
    phrase: 'camping'
  }
}


## Draw Round
Is similar to the phrase round so I'll write down the sequence of messages rather than
explain everything. Let's walk through round 2 of the example game for this demonstration.
The only thing that might be worth noting is that scaling should be handled by the client
preferably to some uniform size (stretching should be fine) and then rescaled to fit the client's canvas.

#### Server to player1
{
  type: 'draw'
  data: {
    bookId: 'player2'
    data: 'camping'
  }
}

#### Server to player2
{
  type: 'draw'
  data: {
    bookId: 'player1'
    data: 'camel'
  }
}

#### Server to all clients
{
  type: 'timer',
  data: {
    timeLeft: 30
  }
}

#### Server to all clients
{
  type: 'timer',
  data: {
    timeLeft: 29
  }
}

etc...

#### Server to all clients
{
  type: 'gamestatus',
  data: {
    status: 'expectData'
  }
}

#### player1 to server
{
  type: 'drawDataSend'
  data: {
    gameId: 'okje34'
    bookId: 'player2'
    canvas: 'picture_data'
  }
}

#### player2 to server
{
  type: 'drawDataSend'
  data: {
    gameId: 'okje34'
    bookId: 'player1'
    canvas: 'picture_data'
  }
}


## End Results
Since we only have 2 players, after first phrase round and 1 draw round, the server
will send end results will be sent. That's all the server functionality should support for now.