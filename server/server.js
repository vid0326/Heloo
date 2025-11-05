const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { User } = require('./models/User')
const cookieParser = require('cookie-parser');
const { setUpSocket } = require('./socket');
const morgan = require('morgan');
const { authMiddleware } = require('./middlewares/AuthMiddleware');
const path = require('path')

const server = express();
dotEnv.config();

server.use(morgan('dev'));
server.use(cookieParser());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


server.get("/", (req, res) => {
    res.send("API is Running Successfully");
});

server.use('/uploads/channelProfileImages', authMiddleware, express.static('uploads/channelProfileImages'));
server.use('/uploads/profileImages', authMiddleware, express.static('uploads/profileImages'));
server.use('/uploads/files', authMiddleware, express.static('uploads/files'));

server.use('/auth', require('./routes/AuthRoutes'));
server.use('/user', authMiddleware, require('./routes/UserRoutes'));
server.use('/profile', authMiddleware, require('./routes/ProfileRoutes'));
server.use('/contacts', authMiddleware, require('./routes/ContactRoutes'));
server.use('/messages', authMiddleware, require('./routes/MessageRoutes'));
server.use('/channels', authMiddleware, require('./routes/ChannelRoutes'));

const httpServer = server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
}
);

const io = setUpSocket(httpServer);
server.set('io', io);