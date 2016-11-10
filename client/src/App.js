import React, { Component } from 'react';
import { Link } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import './App.css';

injectTapEventPlugin();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      payload: {}
    };
  }

  componentDidMount() {
    fetch("/hello", {
      accept: 'application/json',
    }).then((response) => {
      return response.json();
    }).then((response) => {
      this.setState({
        open: false,
        payload: response
      });
    });
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            title="Telephone Pictionary"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonTouchTap={this.handleToggle}
          />
          {this.props.children}

          <Drawer
            docked={false}
            className="App"
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <MenuItem containerElement={<Link to="/lobby" />}>Lobby</MenuItem>
            <MenuItem containerElement={<Link to="/drawboard" />}>Drawboard</MenuItem>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
