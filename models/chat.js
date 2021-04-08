const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    username: {type: String},
    sessionID: {type: String},
    userID: { 
        type: String, unique: true, required: true
    },
    connect: { type: Boolean}
});

module.exports = mongoose.model( "Chat", chatSchema );