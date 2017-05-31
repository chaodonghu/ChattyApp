// Import jsx
import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

// Define application data
const chattyData = {
  currentUser: {username: "Dong"}, // optional, if currentuser is not defined, it means the user is Anonymous
  messages: [] //messages coming from the server will be stored here as they arrive
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = chattyData;
    this.handleInsertMessage = this.handleInsertMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    // Connects React app to WebSocket server
    this.connection = new WebSocket("ws://localhost:3001");
    this.connection.onopen = (event) => {
      console.log("We are connected");
    }
  }

sendMessage(message) {
  this.connection.send(JSON.stringify(message));
  console.log('Message sent from client to server');
}

handleInsertMessage = (message) => {
    let length = this.state.messages.length + 1;

    const newMessage = {id: length, username: message.username, content: message.content};
    // const messages = this.state.messages.concat(newMessage);
    // this.setState({messages: messages});

    // Messages going back and forth through the WebSocket connection
    this.sendMessage({message: newMessage});
  }

  // in App.jsx
  componentDidMount() {
    this.connection.onmessage = (event) => {
      const serverData = JSON.parse(event.data);
      console.log('Data coming back from server to client', serverData);
      const serverDataArray = [];
      serverDataArray.push(serverData.message);
      this.setState({messages: this.state.messages.concat(serverDataArray)})
    }
  }

  render() {
    console.log("Rendering <App/>");
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages={this.state.messages}/>
        <ChatBar currentUser={this.state.currentUser} InsertMessage={this.handleInsertMessage}/>
      </div>
    );
  }
}

export default App;
