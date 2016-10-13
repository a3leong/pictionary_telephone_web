import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import App from './App';
import Lobby from './Lobby';
import DrawBoard from './DrawBoard';
import './index.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="lobby" component={Lobby} />
      <Route path="drawboard" component={DrawBoard} />
    </Route>
  </Router>,
  document.getElementById('root')
);
