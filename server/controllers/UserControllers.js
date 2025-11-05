const { User } = require('../models/User');

exports.fetchLoggedInUser = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId).select('-password');
        res.json(user);
    } catch (error) {
        console.error("Error fetching logged-in user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
}