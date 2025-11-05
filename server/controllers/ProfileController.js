const { User } = require('../models/User');
const multer = require('multer')
const fs = require('fs')

exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true, select: '-password' },
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Error updating profile" });
    }
}

exports.updateProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const { userId } = req;

        const fileName = "uploads/profileImages/" + Date.now() + '_' + req.file.originalname;
        fs.renameSync(req.file.path, fileName);
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profileImage: fileName },
            { new: true, select: '-password -email' }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating profile image:", error);
        return res.status(500).json({ message: "Error updating profile image" });
    }
}

exports.deleteProfileImage = async (req, res) => {
    const { userId } = req;
    try {
        const user = await User.findById(userId);
        if (!user || !user.profileImage) {
            return res.status(404).json({ message: "User or profile image not found" });
        }
        fs.unlinkSync(user.profileImage);
        user.profileImage = null;
        await user.save();
        res.status(200).json({ message: "Profile image deleted successfully" });
    } catch (error) {
        console.error("Error deleting profile image:", error);
        return res.status(500).json({ message: "Error deleting profile image" });
    }
}