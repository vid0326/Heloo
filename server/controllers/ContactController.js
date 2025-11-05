const { default: mongoose } = require("mongoose");
const { User } = require("../models/User");
const { DirectMessage } = require("../models/DirectMessage");

exports.searchContacts = async (req, res) => {

    try {
        const { searchTerm } = req.body;
        if (searchTerm === undefined || searchTerm === null) {
            return res.status(400).send("searchTerm is required.");
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(sanitizedSearchTerm, "i");
        // i flag for case-insensitive search

        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                    $or: [
                        { username: regex },
                        { fullName: regex },
                        // { lastName: regex },
                    ]
                }
            ]
        }).select("-password -email");

        res.status(200).json({ contacts });
    } catch (error) {
        console.error("Error searching contacts:", error);
        res.status(500).json({ message: "Error searching contacts" });
    }

}

exports.getDmContactList = async (req, res) => {
    try {
        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);
        const contacts = await DirectMessage.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                }
                // $match: {
                //     $and: [
                //         { receiver: { $ne: null } },
                //         {
                //             $or: [
                //                 { sender: userId },
                //                 { receiver: userId }
                //             ]
                //         }
                //     ]
                // }
            },
            {
                $sort: { timestamp: -1 } // latest on the top
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$receiver",
                            else: "$sender",
                        },
                    },
                    lastMessage: { $first: "$timestamp" },

                }
            },
            {
                $lookup: {
                    from: "users",              // The collection you're joining with
                    localField: "_id",          // The field in your current data (contact's ID)
                    foreignField: "_id",        // The matching field in the 'users' collection
                    as: "contactInfo"           // The result will go into a new field named 'contactInfo'
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    username: "$contactInfo.username",
                    fullName: "$contactInfo.fullName",
                    color: "$contactInfo.color",
                    profileImage: "$contactInfo.profileImage",
                    bio: "$contactInfo.bio",
                }
            },
            {
                $sort: { lastMessage: -1 }
            }
        ]
        );

        res.status(200).json({ contacts });
    } catch (error) {
        console.error("Error fetching DM contact list:", error);
        res.status(500).json({ message: "Error fetching DM contact list" });
    }
}