import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Config, Types} from './config';
import DrawBoard from './DrawBoard.js';
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
      active: false,
      open: false,
      time: 0,
      players: [],
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
    try {
      if(ev.data==="Connection set") {
        return;
      }
      console.log(ev);
      let msg = JSON.parse(ev.data);
      switch (msg.type) {
        case "config":
          console.log(msg.data.playerIds);
          this.setState({
            players: msg.data.playerIds,
          });
          break;
        case "gamestatus":
          if (msg.data.status === 'firstPhrase') {
            this.setState({
              active: true,
              id: msg.data.gameId,
              bookId: msg.data.bookId,
              time: msg.data.roundTime
            });
          } else if (msg.data.status === 'expectData') {
            console.log('data expected');
          }
          break;
        case "timer":
          this.setState({
            time: msg.data.timeLeft,
          });
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

  start() {
    if (this.state.id != null) {
      this.ws.send(JSON.stringify({
        type: Types.START_GAME_INSTANCE,
        data: {
          gameId: this.state.id,
        }
      }));
    }
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
        {!this.state.active ?
            (<Card>
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
            </Card>) :
            (<div>
              Time left: {this.state.time}
              <DrawBoard
                gameId={this.state.id}
                bookId={this.state.bookId}
                ws={this.ws}
              />
            </div>)
        }

        {this.state.id != null &&
            (<Card>
              <CardHeader
                title="Lobby Status"
                subtitle={"ID: " + this.state.id}
              />
              <CardText>
                Players:
                <List>
                  {this.state.players.map(player => {
                    return <ListItem key={player} primaryText={player} />;
                  })}
                </List>
                <FlatButton 
                  disabled={this.state.players.length < 2}
                  onTouchTap={this.start.bind(this)}
                  label="Start Game" 
                />
              </CardText> 
            </Card>)
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
