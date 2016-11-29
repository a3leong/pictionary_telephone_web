import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';

import './Lobby.css';

class Lobby extends Component {
  render() {
    return (
      <div className="Lobby">
        <Card>
          <CardHeader
            title="Telephone Pictionary"
            subtitle="Create or join a game"
            style={{"width": "60vw"}}
          />
          <CardText>
            <TextField
              hintText="Your Name"
            />
          </CardText>
          <CardActions>
            <FlatButton label="Create Game" />
            <FlatButton label="Join Game" />
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default Lobby;
