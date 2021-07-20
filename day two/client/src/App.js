import { Component } from "react";
import {Card,Avatar,Typography,Input, message} from "antd";
import {w3cwebsocket as W3CWebSocket} from "websocket";

const {Text}=Typography;
const {Search}=Input;
const {Meta}=Card;

const client=new W3CWebSocket("ws://127.0.0.1:9999");

class App extends Component
{
  state={
    userName:'',
    isLoggedIn:false,
    messages:[]
  }
  clicked = (value) => {
    client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: this.state.userName
    }));
    this.setState({ searchVal: '' })
  }
  componentDidMount=()=>
      {
        client.onopen = () => {
          console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
          const dataFromServer = JSON.parse(message.data);
          console.log('got reply! ', dataFromServer);
          if (dataFromServer.type === "message") {
            this.setState((state) =>
              ({
                messages: [...state.messages,
                {
                  msg: dataFromServer.msg,
                  user: dataFromServer.user
                }]
              })
            );
          }
        };
      }
  render()
  {
    return(
    <>
      {this.state.isLoggedIn?
      <div>
        <h1>Chat room</h1>
        <div>
          <Text>Zealous group logged person is: {this.state.userName}</Text>
        </div>
        <div style={{display:'flex',flexDirection:'column'}}>
          {this.state.messages.map(message=>
            <Card key={message.msg} style={{width: 300, margin: '16px 4px 0 4px', alignSelf: this.state.userName === message.user ? 'flex-end' : 'flex-start' }} loading={false}>
              <Meta
                avatar={
                  <Avatar style={{backgroundColor:'violet',color:'wheat'}}>{message.user[0].toUpperCase()}</Avatar>
                }
                title={message.user}
                description={message.msg}
              />
            </Card>
          )}
        </div>
        <div>
          <Search
            placeholder="Message here"
            enterButton="Send"
            value={this.state.searchVal}
            size="large"
            onChange={(e) => this.setState({ searchVal: e.target.value })}
            onSearch={value => this.clicked(value)}
          />
        </div>
      </div>
      :
      <div>
        <h1>Yet to login</h1>
        <Search
          placeholder="Enter the your name"
          enterButton="Login"
          size="large"
          onSearch={value => this.setState({ isLoggedIn: true, userName: value })}
        />
      </div>
      }
    </>);
  }
}

export default App;
