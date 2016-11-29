import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

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
    // fetch("/hello", {
    //   accept: 'application/json',
    // }).then((response) => {
    //   return response.json();
    // }).then((response) => {
    //   this.setState({
    //     open: false,
    //     payload: response
    //   });
    // });
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
