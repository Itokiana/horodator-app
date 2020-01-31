import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Dashboard from "./components/Dashboard/Dashboard";
import LoginForm from './components/Auth/LoginForm';


class App extends Component {
  render(){
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/auth" component={ LoginForm } />
          <Route path="/" component={ Dashboard } />
        </Switch>
      </BrowserRouter>
    );
  }
}


export default App;
