import React, {useState, useEffect} from "react";
import socketIO from "../utils/socket"
import AuthService from "../services/authService"
import Inbox from "../components/Chat/index"


function Chat() {
  const currentUser = AuthService.getCurrentUser();
  const username = currentUser.username
  // const [users, setUsers] = useState([])
  let array = []
  const { socket } = socketIO()

  useEffect (() => {
    const currentSession = localStorage.getItem("sessionID")

    if(currentSession){
      socket.auth = { sessionID: currentSession };
      socket.auth = { username: username }
      
      console.log(currentSession)
      socket.connect()
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

    const initReactiveProperties = (user) => {
      user.hasNewMessages = false;
    };

    socket.on("users", users => {
      users.forEach((user) => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });
      // put the current user first, and sort by username
     array = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      console.log(array)
  })

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {

       console.log(err.message)
      }
    });  

    return () => {
      if (socket) {
        // socket.removeAllListeners();
        // socket.close();
        socket.off("connection_error");
      }
    };
  }, [])
  
  
  
  return (
    <div>
      <Inbox users={array} />
      
    </div>
  );
}
export default Chat;
