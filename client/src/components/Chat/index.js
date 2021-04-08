import React, {useState, useEffect} from "react";
import socketIO from "../../utils/socket"
import AuthService from "../../services/authService"
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import API from '../../utils/API'


function Inbox (props) {
    const currentUser = AuthService.getCurrentUser();
    const [username, setUsername] = useState(currentUser.username)
    const [usernameIsSet, setUsernameIsSet] = useState(false)
    const [message, setMessage] = useState()
    const [sessionID, setSessionID] = useState()
    const [selectedUser, setSelectedUser] = useState({ userID: 'i-7GDlg9FYfuRWbTAAAF', username: 'Muffins', messages: [] })
    const users = []
    const { socket } = socketIO()
    
    function messageChange (e){
        setMessage(e.target.value)
      }
      
    
      function handleSubmit (e){
        e.preventDefault()
        
        
        if (message) {
            socket.emit("private message", {
                content: message,
                to: "_HOHd-KkvQxkgY7mAAAD",
              });
              socket.auth = { username: username}
              socket.connect()
          
          API.saveMessage({
              conversationID: sessionID,
              participants: [socket.userID, selectedUser.userID],
              messages: [{
                  author: username,
                  authorId: socket.userID,
                  recipient: selectedUser.userID,
                  content: message
              }]
          })
          .then(() => {
            
            //   selectedUser.messages.push({
            //     content: message,
            //     fromSelf: true,
            //   });
              console.log(message)
          })
          .catch(err => console.log(err))
          setMessage("");
          

        } else {
        alert("your message needs to be longer")
        }
      }
    
      useEffect(() => {
        
        setSessionID(localStorage.getItem("sessionID"))
          
        socket.on("connect", () => {
            users.forEach((user) => {
              if (user.self) {
                user.connected = true;
              }
            });
          });
          
          socket.on("disconnect", () => {
            users.forEach((user) => {
              if (user.self) {
                user.connected = false;
              }
            });
          });

          const initReactiveProperties = (user) => {
            user.hasNewMessages = false;
          };
    
          
    
          socket.on("user connected", (user) => {
            initReactiveProperties(user);
            users.push(user);
            console.log(user)
          });
    
          socket.on("user disconnected", (id) => {
            for (let i = 0; i < users.length; i++) {
              const user = users[i];
              if (user.userID === id) {
                user.connected = false;
                break;
              }
            }
          });
    
        socket.on("private message", ({ content, to }) => {
            socket.to(to).emit("private message", {
                content,
                from: socket.id,
              });
        });
    
        return () => {
          if (socket) {
            socket.removeAllListeners();
            socket.close();
            socket.off("connect");
            socket.off("disconnect");
            socket.off("users");
            socket.off("user connected");
            socket.off("user disconnected");
            socket.off("private message");
          }
        };
      }, []);
      
      
      
      return (
        <div>
          <h1 className='Header'>Chat:</h1>
          <Container>
            <Row>
              <Col xs={12} md={4}>
                <ul>
                  <li className="user-list-item">User 1 <i className="fas fa-circle green-circle"> Online</i></li>
                  {/* {users.map(user => 
                { return ( user ? <li>{user.username}<br/><br/> <i class="fas fa-circle green-circle">Online</i></li> : 
                <li>{user.username}<br/><br/><i class="fas fa-circle red-circle">Offline</i></li>)})} */}
                </ul>
              </Col>
              <Col xs={12} md={8}>
                <Row>
                  <div className="display">
                    <h5>Username</h5>
                    <p>This is my message!!</p>
                  </div>
                </Row>
                <Row>
                  <Form>
                    <Form.Group controlId="formMessageContent">
                      <Form.Control as="textarea"  rows={3} placeholder="What's on your mind?" onChange={messageChange} className="messageBox" value={message} />
                      <Form.Text className="text-muted">
                        Type your message above.
                      </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={handleSubmit} >
                      Submit
                    </Button>
                  </Form>
                </Row>
              </Col>
              
            </Row>
          </Container>
          
        </div>
      );
    }
    export default Inbox;