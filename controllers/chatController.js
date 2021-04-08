const db = require("../models");

// Defining methods for the conversationController
module.exports = {
  findAll: function(req, res) {
    db.Chat
      .find(req)
      .then(dbModel => res.json(dbModel))
      .catch(err => console.log(err));
  },
  findById: function(req, res) {
      console.log("Find By Req: " + req)
    db.Chat
      .find({sessionID: req})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Chat
      .create(req)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  updateById: function(req, res) {
      console.log("chat24 " + req)
      console.log("chat25 " + req.userID)
      console.log("chat26 " + req.params)
    db.Chat
      .findOneAndUpdate({_id: req.sessionID}, {$set: {
        sessionID: req.sessionID,
        userID: req.userID,
        username: req.username,
        connect: req.connect,
      } }, {new: true},
        (err) => {
          if(err){
            console.log("err with update")
          }
        })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};