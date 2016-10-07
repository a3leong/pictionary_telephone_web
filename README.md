# Pictionary Telephone
Technology used: NodeJS, WS websocket api

# Description
An online telephone pictionary game using websockets.
Players create/join a game using a room code and 

# Data transfer
Data payload is transferred through websockets as stringified JSON.
The JSON contains a message type field and an embedded data field that contains a relevant
JSON object containing necessary fields based on the type of message sent/recieved.

# What's done so far
-Classes have been written for NodeJS to support handling gamelogic
-main.js in the public/js directory has a message handling function written
-Players can create rooms and join them
-Players can start games and the timing system works.


# TODO
-The frontend interface still needs to be done.
-HTML5 canvas object still is not implemented (frontend needs some drawing tools)
 and there is still no datatransfer method for canvas data.
