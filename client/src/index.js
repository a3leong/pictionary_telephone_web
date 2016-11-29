import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App from './App';
import Lobby from './Lobby';
import DrawBoard from './DrawBoard';
import './index.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Lobby} />
      <Route path="drawboard" component={DrawBoard} />
    </Route>
  </Router>,
  document.getElementById('root')
);
