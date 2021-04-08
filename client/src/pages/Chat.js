import React, {useState, useEffect} from "react";
import socketIO from "../utils/socket"
import AuthService from "../services/authService"
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import API from "../utils/API";


function Chat() {
  const currentUser = AuthService.getCurrentUser();
  const username = currentUser.username
  const [usernameIsSet, setUsernameIsSet] = useState(false)
  const [message, setMessage] = useState()
  const [sessionID, setSessionID] = useState()
  const users = []
  const [selectedUser, setSelectedUser] = useState({ userID: 'i-7GDlg9FYfuRWbTAAAF', username: 'Muffins', messages: [] })

  const { socket } = socketIO()

  const initReactiveProperties = (user) => {
    user.messages = []
    user.hasNewMessages = false
  }

  function messageChange (e){
    setMessage(e.target.value)
  }
  

  function handleSubmit (e){
    e.preventDefault()
    
    console.log(socket)
    if (message) {
      
      socket.emit("private message", {
        content: message,
        to: "_HOHd-KkvQxkgY7mAAAD",
      });
      selectedUser.messages.push({
        content: message,
        fromSelf: true,
      });
      console.log(message)

      setMessage("");
    } else {
    alert("your message needs to be longer")
    }
    socket.auth = { username }
    socket.connect()
  }

  useEffect(() => {
    
    if (socket) {
      const currentSession = localStorage.getItem("sessionID")
      setSessionID(currentSession);
      console.log(currentSession)
      if(username){
        setUsernameIsSet(true);
        socket.auth = { sessionID: currentSession };
        socket.auth = { username };
        socket.connect();
      }

      socket.on("session", ({ sessionID, userID }) => {
        // attach the session ID to the next reconnection attempts
        socket.auth = { sessionID };
        // store it in the localStorage
        localStorage.setItem("sessionID", sessionID);
        // save the ID of the user
        socket.userID = userID;
        console.log(sessionID)
      });

      socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {

         console.log(err.message)
        }
      });  

      socket.on("users", users => {
        users.forEach((user) => {
          user.self = user.userID === socket.id;
          initReactiveProperties(user);      
          console.log(user.self)  
        })

        users = users.sort((a, b) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        })
      })

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
    }

    socket.on("private message", ({ content, from }) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.userID === from) {
          user.messages.push({
            content,
            fromSelf: false,
          });
          if (user !== selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });

    return () => {
      if (socket) {
        socket.removeAllListeners();
        socket.close();
        socket.off("connection_error");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("users");
        socket.off("user connected");
        socket.off("user disconnected");
        socket.off("private message");
        socket.off("session");
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
              {users.map(user => 
            { return ( user ? <li>{user.username}<br/><br/> <i class="fas fa-circle green-circle">Online</i></li> : 
            <li>{user.username}<br/><br/><i class="fas fa-circle red-circle">Offline</i></li>)})}
            </ul>
          </Col>
          <Col xs={12} md={8}>
            <Row>
              <div className="display">

              </div>
            </Row>
            <Row>
              <Form>
                <Form.Group controlId="formMessageContent">
                  <Form.Control as="textarea" rows={3} placeholder="What's on your mind?" onChange={messageChange} />
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
export default Chat;
