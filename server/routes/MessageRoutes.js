const express = require('express');
const router = express.Router();
const { uploadFile, getDirectMessages } = require('../controllers/MessageController');
const multer = require('multer');

const uploads = multer({ dest: 'uploads/files' });
router
    .get('/', getDirectMessages)
    .post('/uploadFile', uploads.single('file'), uploadFile)
    // .delete('/:messageId', deleteDirectMessage)

module.exports = router;