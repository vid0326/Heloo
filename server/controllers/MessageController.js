const { DirectMessage } = require('../models/DirectMessage');
const fs = require('fs');

exports.getDirectMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: 'Sender and receiver IDs are required' });
        }

        const messages = await DirectMessage.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching direct messages:', error);
        res.status(500).json({ message: 'Error fetching direct messages' });
    }
}

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const fileName = "uploads/files/" + Date.now() + '_' + req.file.originalname;
        fs.renameSync(req.file.path, fileName);

        res.status(200).json({ filePath: fileName });
    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({ message: "Error uploading file" });
    }
}

// exports.deleteDirectMessage = async (req, res) => {
//     try {
//         const { messageId } = req.params;
//         if (!messageId) {
//             return res.status(400).json({ error: 'Message ID is required' });
//         }

//         await DirectMessage.findByIdAndDelete(messageId);
//         res.status(200).json({ messageId });
//     } catch (error) {
//         console.error('Error deleting message:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }