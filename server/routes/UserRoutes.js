const express = require('express');
const router = express.Router();
const { fetchLoggedInUser } = require('../controllers/UserControllers');

router.get('/', fetchLoggedInUser);

module.exports = router;