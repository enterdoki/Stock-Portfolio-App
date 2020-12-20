import React from 'react';
import './App.css';
import Home from './components/Home/Home'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import Transaction from './components/Transactions/Transaction'
import Portfolio from './components/Portfolio/Portfolio';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
    }
  }

  render() {
    const signupPageComponent = () => (<SignUp />);
    const signInPageComponent = () => (<SignIn/>);
    const stockPageComponent = () => (<Home />);
    const transactionPageComponent = () => (<Transaction/>)
    const portfolioPageComponent = () => (<Portfolio/>)
    return (
      <div className="App">
        <Router>
          <Route exact path='/signup' render = {signupPageComponent}></Route>
          <Route exact path='/' render = {signInPageComponent}></Route>
          <Route exact path='/home' render = {stockPageComponent}></Route>
          <Route exact path= '/transaction' render = {transactionPageComponent}></Route>
          <Route exact path='/portfolio' render={portfolioPageComponent}></Route>
        </Router>
      </div>
    );
  }
}

export default App;
