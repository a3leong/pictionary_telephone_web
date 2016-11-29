import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';

import './Lobby.css';

const names = [
  'Wes',
  'Sarah',
  'Kevin',
  'Jason',
  'Bernard',
  'Ruby',
  'Nadine',
  'Clement',
  'Hannah',
  'Gilia',
];

class Lobby extends Component {
  constructor(props) {
    super(props);
    const randy = Math.floor((Math.random() * 1000) + 1);
    const bottle = Math.floor((Math.random() * names.length));
    const selected = names[bottle] + "x" + randy;
    
    this.state = {
      name: selected,
    };
  }

  create() {
    fetch('/api/createroom', {
      accept: 'application/json',
    }).then(response => {
      return response.json();
    }).then(response => {
      console.log(response);
      this.setState({
        id: response
      })
    });
  }

  render() {
    return (
      <div className="Lobby">
        <Card>
          <CardHeader
            title="Telephone Pictionary"
            subtitle="Create or join a game"
            style={{"width": "40vw"}}
          />
          <CardText>
            <TextField
              hintText="Your Name"
              defaultValue={this.state.name}
            />
          </CardText>
          <CardActions>
            <FlatButton 
              disabled={this.state.id != null}
              onClick={this.create.bind(this)}
              label="Create Game"
            />
            <FlatButton 
              disabled={this.state.id != null}
              label="Join Game" 
            />
          </CardActions>
        </Card>

        {this.state.id != null &&
          <Card>
            <CardHeader
              title="Lobby Status"
              subtitle={"ID: " + this.state.id}
            />
            <CardText>
            </CardText> 
          </Card>
        }
      </div>
    )
  }
}

export default Lobby;
