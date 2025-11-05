const express = require('express');
const router = express.Router();
const { updateProfile, updateProfileImage, deleteProfileImage } = require('../controllers/ProfileController');
const multer = require('multer');


const uploads = multer({ dest: 'uploads/profileImages' });

router.patch('/', updateProfile).post('/image', uploads.single('profileImage'), updateProfileImage).delete('/image', deleteProfileImage);

module.exports = router; 