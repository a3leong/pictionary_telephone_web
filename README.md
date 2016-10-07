# Pictionary Telephone
Technology used: NodeJS, WS websocket api

# Description
An online telephone pictionary game using websockets.
Players create/join a game using a room code and 

# Data transfer
Data payload is transferred through websockets as stringified JSON.
The JSON contains a message type field and an embedded data field that contains a relevant
JSON object containing necessary fields based on the type of message sent/recieved.

