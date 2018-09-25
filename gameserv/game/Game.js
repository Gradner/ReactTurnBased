class Game {
  constructor(options){
    this.gameID = options.gameID || '0';
    this.roomName = options.roomName || 'Game';
    this.players = [];
    this.maxPlayers = options.maxPlayers || 2;
    this.currentPlayer = 0;
    this.turnTimerHasStarted = false;
    this.turnTimeRemaining = 0;
    this.socketUrl = options.socketUrl;
    this.gameHasStarted = false;
    this.playersReady = false;
    this.status = 0;
    this.addPlayer = this.addPlayer.bind(this)
  }

  createGame() {
    return socketUrl = '';
  }

  addPlayer(playerID) {
    if(this.players.length < this.maxPlayers){
      this.players.push(playerID)
    } else {
      console.log('error: could not join game, game is full')
    }
  }

}

module.exports = Game;