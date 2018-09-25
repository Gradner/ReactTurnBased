///////////////////////////////////////////////////////////////////
//  Libraries
///////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import io from 'socket.io-client'

///////////////////////////////////////////////////////////////////
//  Components
///////////////////////////////////////////////////////////////////

import Login from './Screens/Login'
import GameList from './Screens/GameList'

///////////////////////////////////////////////////////////////////
//  Intialization
///////////////////////////////////////////////////////////////////

const socket = io('http://localhost:5999')

///////////////////////////////////////////////////////////////////
//  Class Definition
///////////////////////////////////////////////////////////////////

class App extends Component {
  constructor(props){
    super(props);
  }

  state = {
    games: [],
    users: [],
    activeGame: {},
    joinedGame: false,
    gameState: 0,
  }

  componentWillMount = () => {
    socket.on('connect', () => {
      console.log('connected 2 socketboi')
    })

    socket.on('gameList', (games)=>{
      this.setState({
        games: games
      })
    })

    socket.on('userList', (users)=>{
      this.setState({
        users: users
      })
    })
  }

  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resizeClient);
  }

  ///////////////////////////////////////////////////////////////////
  //  Login Screen Functions
  ///////////////////////////////////////////////////////////////////

  userLogin = (username) => {
    socket.emit('login', username)
    this.setState({
      gameState: 1
    })
  }

  resizeClient = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.setState({
      windowWidth: width,
      windowHeight: height
    })
  }

  getScreen = (gamestate) => {
    switch(gamestate){
      case 0:
        return (<Login socket={socket} onLogin={ this.userLogin }/>)
        break;
      case 1:
        return (<GameList socket={socket}/>)
        break;
    }
  }

  render() {
    return (
      <div>
        {this.getScreen(this.state.gameState)}
      </div>
    );
  }
}

export default App;
