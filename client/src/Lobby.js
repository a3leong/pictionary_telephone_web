import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Card, CardText} from 'material-ui/Card';

import './Lobby.css';

class Lobby extends Component {
  render() {
    return (
      <div className="Lobby">
        <Card>
          <CardText>
            <TextField
              hintText="Your Name"
            />
            <TextField
              hintText="Game ID"
            /><br />

            <RaisedButton label="Create Game" />
            <RaisedButton label="Join Game" />
            <RaisedButton label="Start Game" />
          </CardText>
        </Card>
      </div>
    )
  }
}

export default Lobby;
