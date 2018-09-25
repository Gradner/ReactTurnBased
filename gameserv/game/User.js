class User {
  constructor(options){
    this.username = options.username;
    this.uid = options.uid || 0;
    this.socketID = options.socketID;
  }
}

module.exports = User;