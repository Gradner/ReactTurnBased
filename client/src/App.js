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
    currentUser: {},
    users: [],
    activeGame: {},
    gameState: 0,
  }

  componentWillMount = () => {
    socket.on('connect', () => {
      console.log('connected 2 socketboi')
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

  changeGameState = (requestedState) => {
    this.setState({
      gameState: requestedState,
    })
  }

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
        return (<Login
          socket={socket}
          onStateChange={ this.changeGameState }
          onLogin={ this.userLogin }
          />)
        break;
      case 1:
        return (<GameList
          socket={socket}
          onStateChange={ this.changeGameState }
          />)
        break;
    }
  }

  render() {
    return (
      <div>
        <div style={styles.topBar}></div>
        {this.getScreen(this.state.gameState)}
      </div>
    );
  }
}

export default App;

///////////////////////////////////////////////////////////////////
//  CSS BS
///////////////////////////////////////////////////////////////////

const styles = {
  topBar: {
    position: 'relative',
    top: '0px',
    backgroundColor: '#414141',
    boxShadow: '0px 0px 10px',
    height: '48px',
    width: '100%',
    display: 'block'
  }
}