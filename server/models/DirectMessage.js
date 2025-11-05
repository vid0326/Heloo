const mongoose = require('mongoose');

const DirectMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    receiver: {
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
    isRead: {
        type: Boolean,
        default: false
    }
});

exports.DirectMessage = mongoose.model('DirectMessages', DirectMessageSchema);