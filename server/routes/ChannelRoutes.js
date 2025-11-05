const express = require('express');
const router = express.Router();
const { createChannel, getChannels, getChannelMessages, removeMember, getChannelMembers, addMembers, updateChannelProfileImage, deleteChannelProfileImage, updateChannelProfile, deleteChannel, leaveChannel, } = require('../controllers/ChannelController');
const multer = require('multer');

const uploads = multer({ dest: 'uploads/channelProfileImages' });

router.post('/create', createChannel)
    .get('/', getChannels)
    .get('/messages/:channelId', getChannelMessages)
    .get('/members/:channelId', getChannelMembers)
    .post('/remove-member', removeMember)
    .post('/leave-channel', leaveChannel)
    .post('/add-members', addMembers)
    .patch('/channel-profile/:channelId', updateChannelProfile)
    .post('/channel-image/:channelId', uploads.single('channelProfileImage'), updateChannelProfileImage)
    .delete('/channel-image/:channelId', deleteChannelProfileImage)
    .delete('/delete/:channelId', deleteChannel);
// .delete('/message/delete/:channelMessageId', deleteChannelMessage)
// .delete('/admin-delete-message/:channelMessageId', deleteChannelMessageByAdmin)

module.exports = router;