const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    username: {type: String},
    sessionID: {type: String},
    userID: { 
        type: String, required: true
    },
    connected: { type: Boolean}
});

module.exports = mongoose.model( "Chat", chatSchema );