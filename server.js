const express = require("express");
const path = require("path");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const db = require("./models")
const Chat = db.Chat

const PORT = process.env.PORT || 3001;
const app = express();
// const expressServer = 
const httpServer = require('http').createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

io.use((socket, next) => {
  
  const sessionID = socket.handshake.auth.sessionID;
  const username = socket.handshake.auth.username;
  
 
  if (sessionID) {
    // find existing session
    Chat.find({sessionID: sessionID}).then(session => {
    if (session !== undefined) {
      socket.sessionID = sessionID;
      socket.userID = session[0].userID;
      socket.username = session[0].username;
      return next();
    }
  }
)
.catch((err) => console.log(err))
  }

  if (!username) {
    return next(new Error("invalid username"));
  }
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  console.log('Client connected');
  const { userID, sessionID, username, newSession } = socket.handshake.query
  
  if(socket.sessionID !== undefined){
    Chat.create({
      sessionID: socket.sessionID,
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });
  }
  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // join the "userID" room
  socket.join(socket.userID);

  const users = [];
  Chat.find({}).then(res => {
    const allSessions = res
  if(allSessions !== undefined){
  allSessions.forEach(session => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected
    })    
  })
  socket.emit("users", users)
  }
  })
  .catch(err => console.log(err))
  
  


  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true
  });

  socket.join(socket.userID);
  

  socket.on("private message", ({ content, to }) => {
    console.log("a private message was sent")
    console.log('message: ' + content)
    socket.to(to).to(socket.userID).emit("private message", {
      content,
      to
    });
  });

  socket.on("disconnect", async () => {
    console.log("Client Disconected: " + socket.userID)
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      Chat.updateMany({sessionID: socket.sessionID}, {$set: {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      }});
    }
  });
});



// To be used is running locally:
var corsOptions = {
  origin: "http://localhost:3001",
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// connection to mongoose db
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/bffl_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error: ", err);
    process.exit();
  });

require("./routes/authRoutes")(app);
require("./routes/userRoutes")(app);
app.use(routes);

// for React build
const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

httpServer.listen(PORT, function () {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
})