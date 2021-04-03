import React, {useState} from "react";
import socketIO from "../utils/socket"
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button';

function Chat() {
  const [message, setMessage] = useState()

  const { socket } = socketIO()

  function messageChange (e){
    setMessage(e.target.value)
    console.log(e.target.value)
  }

  function handleSubmit (e){
    e.preventDefault()
    console.log(socket)
    if (message) {
      socket.emit('chat message', message);
      console.log(message)
      setMessage();
    } else {
    alert("your message needs to be longer")
    }
  }
  
  return (
    <div>
      <h1 className='Header'>Chat:</h1>
      <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>User</Form.Label>
        <Form.Control type="email" placeholder="Enter username" />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Message</Form.Label>
        <Form.Control type="text" placeholder="Message" onChange={messageChange} />
        <Form.Text className="text-muted">
          ype your message above.
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleSubmit} >
        Submit
      </Button>
    </Form>
    </div>
  );
}
export default Chat;
