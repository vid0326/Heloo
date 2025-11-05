const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/AuthController');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { authMiddleware } = require('../middlewares/AuthMiddleware');
const { fetchLoggedInUser } = require('../controllers/UserControllers');

router.post('/register', register).post('/login', login).get('/logout', logout).get('/', authMiddleware, fetchLoggedInUser);

module.exports = router; 