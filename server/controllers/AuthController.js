const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// TODO: Implement resetPassword like i did in previous project

exports.register = async (req, res) => {

    try {
        const { fullName, username, email, password } = req.body;

        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username not available" });
        }

        const user = new User({
            fullName,
            username,
            email,
            password
        });

        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.status(201).json({
            username: user.username,
            fullName: user.fullName,
            color: user.color,
            profileImage: user.profileImage,
            bio: user.bio,
            _id: user._id
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Error creating user" });
    }
}

exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        res.status(200).json({
            username: user.username,
            fullName: user.fullName,
            color: user.color,
            profileImage: user.profileImage,
            bio: user.bio,
            _id: user._id
        });
    }
    catch (error) {
        console.error("Error login in:", error);
        return res.status(500).json({ message: "Error logging in" });
    }
}

exports.logout = async (req, res) => {

    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });
    res.status(200).json({ message: "Logged out successfully" });

}