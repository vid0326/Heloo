const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema(
    {
        // NOTE: Without sparse: true, mongoose would not allow multiple null or missing values for a unique field.
        username: { type: String, unique: true, required: true },
        fullName: { type: String, required: [true, "Full Name is required"] },
        email: { type: String, required: [true, "Email is required"], unique: true },
        password: { type: String, required: [true, "Email is required"] },
        profileImage: { type: String, default: null },
        bio: { type: String, default: "bio" },
        color: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
)

UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, 10)
    next();
})

exports.User = mongoose.model('Users', UserSchema)