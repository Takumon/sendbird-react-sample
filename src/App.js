import React from 'react';
import { Router, Route } from 'react-router-dom'
import history from './history'
import './App.css';
import Login from './containers/login';
import SendBirdMessages from './containers/sendbird-messages';

function App() {
  return (
    <Router history={history}>
      <div className="App">
        <Route exact path="/" component={SendBirdMessages} />
        <Route exact path='/login' component={Login} />
        <Route path='/channel' component={SendBirdMessages} />
      </div>
    </Router>
  );
}

export default App;
