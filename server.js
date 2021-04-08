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



io.on('connection', (socket) => {
  console.log('Client connected');
  const { userID, sessionID, username } = socket.handshake.query
  
  if(socket.sessionID !== undefined){
    Chat.updateOne({sessionID: sessionID}, {$set: {
      sessionID: socket.sessionID,
      userID: socket.userID,
      username: socket.username,
      connected: true,
    }});
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
    console.log(res.data + " all sessions")
    const allSessions = res.data
  if(allSessions !== undefined){
  allSessions.forEach(session => {
    users.push({
      userID: sesion.userID,
      username: session.username,
      connect: session.connect
    })
    console.log(users)
  })
  }
  })
  .catch(err => console.log(err))
  
  socket.emit("users", users)


  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  socket.join(socket.userID);
  
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });

  socket.on("private message", ({ content, to }) => {
    console.log('message: ' + content)
    socket.to(to).to(socket.userID).emit("private message", {
      content,
      from: socket.userID,
      to
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected')
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

io.use((socket, next) => {
  
    const sessionID = socket.handshake.auth.sessionID;
    
    if (sessionID) {
      // find existing session
      Chat.find({sessionID: sessionID}).then(session => {
        console.log("Session Info")
        console.log(session)
      if (session) {
        socket.sessionID = sessionID;
        socket.userID = session[0].userID;
        socket.username = session[0].username;
        console.log("find: " + sessionID)
        console.log(session[0].userID)
        return next();
      }
    }
  )
  .catch((err) => console.log(err))
    }
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    // create new session
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();
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