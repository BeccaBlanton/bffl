const express = require("express");
const path = require("path");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
// const socketio = require('socket.io')
// const httpServer = require("http").createServer(app);
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



// socketio(expressServer)

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
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