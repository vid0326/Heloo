const mongoose = require('mongoose');
const { Channel } = require('./Channel'); 

const channelMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'file'],
        required: true
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === 'text';
        }
    },
    fileURL: {
        type: String,
        required: function () {
            return this.messageType === 'file';
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

exports.ChannelMessage = mongoose.model('channelMessages', channelMessageSchema);