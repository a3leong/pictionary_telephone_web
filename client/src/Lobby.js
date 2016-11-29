import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Config, Types} from './config';
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

const last = [
  'Lau',
  'Chang',
  'Lee',
  'Lu',
  'Chen',
  'Nguyen',
  'Fong',
  'Ng',
  'Wu',
  'Tam',
];

class Lobby extends Component {
  constructor(props) {
    super(props);
    const randy = Math.floor(Math.random() * last.length);
    const bottle = Math.floor(Math.random() * names.length);
    const selected = names[bottle] + " " + last[randy];
    
    this.state = {
      name: selected,
      open: false,
    };
  }

  componentDidMount() {
    this.socketize();
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

      this.join();
    });
  }

  socketize() {
    this.ws = new WebSocket("ws://" + window.location.hostname + ":" + Config.BACKEND_PORT);
    this.ws.onopen = this.join.bind(this);
    this.ws.onmessage = this.handle.bind(this);
  }

  join() {
    if (this.state.id != null) {
      this.ws.send(JSON.stringify({
        type: Types.JOIN_GAME_INSTANCE,
        data: {
          gameId: this.state.id,
          playerId: this.state.name,
        }
      }));
    }

    this.handleClose();
  }

  handle(ev) {
    console.log(ev);
    try {
      let msg = JSON.parse(ev.data);
      switch (msg.type) {
        case "config":
          console.log(msg.data.playerIds);
          break;
        default:
          console.log("unhandled");
          console.log(msg);
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  handleChange(ev) {
    this.setState({id: ev.target.value});
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Go"
        primary={true}
        onTouchTap={this.join.bind(this)}
      />,
    ];

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
              onTouchTap={this.create.bind(this)}
              label="Create Game"
            />
            <FlatButton 
              disabled={this.state.id != null}
              onTouchTap={this.handleOpen.bind(this)}
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

        <Dialog
          title="Join existing game"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
        >
          <p>Pass an ID to join an existing game!</p>
          <TextField
            hintText="Game ID"
            onChange={this.handleChange.bind(this)}
          />
        </Dialog>
      </div>
    )
  }
}

export default Lobby;
