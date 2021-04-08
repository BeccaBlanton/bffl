const db = require("../models");

// Defining methods for the conversationController
module.exports = {
  findAll: function(req, res) {
    db.Conversation
      .find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Conversation
      .find({username: req.params.id})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Conversation
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  updateById: function(req, res) {
    db.Conversation
      .findOneAndUpdate({_id: req.params.id}, {$set: req.body }, {new: true},
        (err) => {
          if(err){
            console.log("err with update")
          }
        })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};