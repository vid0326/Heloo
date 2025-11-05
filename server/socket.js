const { Server } = require('socket.io');
const { Channel } = require('./models/Channel');
const { ChannelMessage } = require('./models/ChannelMessage');
const { DirectMessage } = require('./models/DirectMessage');
// const { deleteDirectMessage } = require('./controllers/MessageController');

const setUpSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
            credentials: true
        }
    });


    const userSocketMap = new Map();
    io.userSocketMap = userSocketMap;
    // NOTE: This map holds the relationship between user IDs and their corresponding socket IDs.

    const sendDirectMessage = async (message) => {
        // console.log('Received message:', message);
        const senderSocketId = userSocketMap.get(message.sender);
        const receiverSocketId = userSocketMap.get(message.receiver);

        const createMessage = await new DirectMessage(message).save();

        // console.log('Message saved:', createMessage);

        const messageData = await DirectMessage.findById(createMessage._id)
            .populate('sender', 'username fullName color profileImage')
            .populate('receiver', 'username fullName color profileImage');


        if (receiverSocketId) {
            // console.log('Populated message data:', messageData);
            io.to(receiverSocketId).emit('receiveMessage', messageData);

        }

        if (senderSocketId) {
            // console.log('Populated message data: sender', messageData);
            io.to(senderSocketId).emit('receiveMessage', messageData);
        }
    }

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileURL } = message;
        // console.log('Received channel message:', message);
        // const senderSocketId = userSocketMap.get(message.sender);
        // const channelId = message.channelId;

        const newMessage = new ChannelMessage({ sender, messageType, content, fileURL });

        const createMessage = await newMessage.save();
        // console.log('Channel message saved:', createMessage);
        const messageData = await ChannelMessage.findById(createMessage._id)
            .populate('sender', 'username fullName color profileImage');

        const channel = await Channel.findByIdAndUpdate(channelId, { $push: { messages: createMessage._id } }, { new: true }).populate('members').exec();

        // console.log('Populated channel message data:', messageData);
        const finalData = { ...messageData._doc, channelId: channel._id }
        // console.log(finalData)
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSockedId = userSocketMap.get(member._id.toString());
                const adminSockedId = userSocketMap.get(channel.admin._id.toString());
                if (memberSockedId && memberSockedId !== adminSockedId) {
                    // console.log('member', memberSockedId)
                    io.to(memberSockedId).emit("receive-channel-message", finalData);
                }
            })
            const adminSockedId = userSocketMap.get(channel.admin._id.toString());
            if (adminSockedId) {
                // console.log('admin', adminSockedId)
                io.to(adminSockedId).emit("receive-channel-message", finalData);
            }
        }
    }

    const deleteDirectMessage = async (message) => {
        // console.log('Deleting message with ID:', messageId);
        const { messageId, senderId, receiverId } = message;
        if (!messageId || !senderId || !receiverId) {
            console.error('Message ID or senderId or receiverId not provided');
            return;
        }
        const deleteDirectMessage = await DirectMessage.findByIdAndDelete(messageId);

        if (!deleteDirectMessage) {
            console.error('Message not found or already deleted');
            return;
        }
        // console.log('Message deleted:', deletedMessage);
        // Notify the sender and receiver about the deletion
        const senderSocketId = userSocketMap.get(senderId.toString());
        const receiverSocketId = userSocketMap.get(receiverId.toString());
        if (senderSocketId) {
            io.to(senderSocketId).emit('direct-message-deleted', { messageId });
        }
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('direct-message-deleted', { messageId });
        }
    }

    const deleteChannelMessage = async (message) => {
        const { channelMessageId, channelId } = message;
        if (!channelMessageId || !channelId) {
            console.error('Channel message ID or channel ID not provided');
            return;
        }
        const deletedChannelMessage = await ChannelMessage.findByIdAndDelete(channelMessageId);
        // console.log('Channel message deleted:', deletedChannelMessage);
        // console.log('Channel message deleted:', deletedChannelMessage);
        if (!deletedChannelMessage) {
            console.error('Channel message not found or already deleted');
            return;
        }

        await Channel.findByIdAndUpdate(channelId, { $pull: { messages: channelMessageId } }).exec();
        // Notify all members of the channel about the deletion
        const channel = await Channel.findById(channelId).populate('members').exec();
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit('channel-message-deleted', { channelMessageId });
                }
            });
            const adminSockedId = userSocketMap.get(channel.admin._id.toString());
            if (adminSockedId) {
                // console.log('admin', adminSockedId)
                io.to(adminSockedId).emit("channel-message-deleted", { channelMessageId });
            }
        }

    }

    const deleteChannelMessageByAdmin = async (message) => {
        const { channelMessageId, channelId } = message;
        if (!channelMessageId || !channelId) {
            console.error('Channel message ID or channel ID not provided');
            return;
        }
        const deletedChannelMessageByAdmin = await ChannelMessage.findByIdAndUpdate(channelMessageId, { isDeleted: true }, { new: true }).select('-content -fileURL -messageType').populate('sender');
        // console.log('Channel message deleted by admin:', deletedChannelMessageByAdmin);

        // Notify all members of the channel about the deletion
        const channel = await Channel.findById(channelId).populate('members').exec();
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit('channel-message-deleted-by-admin', deletedChannelMessageByAdmin);
                }
            });
            const adminSockedId = userSocketMap.get(channel.admin._id.toString());
            if (adminSockedId) {
                // console.log('admin', adminSockedId)
                io.to(adminSockedId).emit("channel-message-deleted-by-admin", deletedChannelMessageByAdmin);
            }
        }
    }

    const broadcastOnlineUsers = () => {
        const onlineUserIds = Array.from(userSocketMap.keys());
        io.emit('online-users', onlineUserIds);
    };

    io.on('connection', (socket) => {

        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            // console.log('Current userSocketMap:', Array.from(userSocketMap.entries()));
            // console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
            broadcastOnlineUsers();
        } else {
            console.log('User ID not provided in handshake query');
        }

        socket.on('send-direct-message', sendDirectMessage);
        socket.on('send-channel-message', sendChannelMessage);
        socket.on('delete-direct-message', deleteDirectMessage);
        socket.on('delete-channel-message', deleteChannelMessage);
        socket.on('delete-channel-message-by-admin', deleteChannelMessageByAdmin);

        socket.on('disconnect', () => {

            for (const [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    // console.log(`User disconnected: ${userId}, Socket ID: ${socket.id}`);
                    broadcastOnlineUsers();
                    break;
                }
            }
        });
    });
    return io;

}

module.exports = { setUpSocket };