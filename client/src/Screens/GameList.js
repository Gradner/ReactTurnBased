import React, { Component } from 'react';
import io from 'socket.io-client'

class GameList extends Component {
  constructor(props){
    super(props);
  }

  state = {
    games: [],
    activeGame: {},
    joinedGame: false,
    gameState: 0,
  }

  componentWillMount = () => {
    this.props.socket.on('connect', () => {
      console.log('connected 2 socketboi')
    })

    this.props.socket.on('gameList', (games)=>{
      this.setState({
        games: games
      })
    })
  }

  componentDidMount = () => {
    this.fetchGames();
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resizeClient);
  }

  resizeClient = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.setState({
      windowWidth: width,
      windowHeight: height
    })
  }

  displayGames = (games) => {
    if(games.length < 1){
      return(<div>No Games Currently Available</div>)
    } else {
      return(
        <div>
        {games.map((game, index)=>(
          <div key={index}>
            <h3>{game.roomName}</h3>
            <span>Current Players: {game.players.length}</span>
            <button onClick={() => this.joinGame(index)}>Join Game</button>
            <button onClick={() => this.gameInfo()}>Game Details</button>
          </div>
          ))}
        </div>
      )
    }
  }

  fetchGames = () => {
    this.props.socket.emit('fetchGames', ()=> { console.log('Requested Games') })
  }

  createGame = () => {
    this.props.socket.emit('createGame', ()=> { console.log('Created New Game') })
  }

  joinGame = (index) => {
    this.props.socket.emit('joinGame', index )
  }

  render() {
    return (
      <div>
        {this.displayGames(this.state.games)}
        <button onClick={() => this.fetchGames()}>Refresh Game List</button>
        <button onClick={() => this.createGame()}>Create New Game</button>
      </div>
    );
  }
}

export default GameList;
