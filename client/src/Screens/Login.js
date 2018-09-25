import React, { Component } from 'react';
import io from 'socket.io-client'

class Login extends Component {
  constructor(props){
    super(props)
  }

  state = {
    username: '',
  }

  _handleLogin = () => {
    this.props.onLogin(this.state.username);
  }

  usernameChanged = (e) => {
    this.setState({
      username: e.target.value,
    })
  }

  render() {
    return(
        <div>
          <h3>Please Login</h3>
          <input type={'text'} placeholder={'Username'} value={this.state.username} onChange={this.usernameChanged}></input>
          <button onClick={this._handleLogin}>Login</button>
        </div>
      );
  }

}

export default Login;