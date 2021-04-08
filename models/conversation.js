const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    participants: [ { type: String } ],
    messages: [{
        author: {type: String},
        authorId: {type: String},
        recipient: {type: String},
        content: {type: String}
    },
    { timestamps: true }
    ]
});

module.exports = mongoose.model( "Conversation", conversationSchema );