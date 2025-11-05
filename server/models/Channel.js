const mongoose = require("mongoose");

// Define schema for a "Channel" collection
const channelSchema = new mongoose.Schema(
  {
    handle: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.ObjectId, ref: "Users", required: true }],
    admin: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
    messages: [{ type: mongoose.Schema.ObjectId, ref: "channelMessages", required: false }],
    bio: { type: String, default: "bio" },
    profileImage: { type: String, default: null },
    color: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Middleware to update `updatedAt` before saving a document
channelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware to update `updatedAt` before findOneAndUpdate operation
channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Create and export the Channel model
exports.Channel = mongoose.model("Channels", channelSchema);
// export default Channel;


// NOTE: findByIdAndDelete is not a valid middleware hook in Mongoose.

// Only these are valid for findAndDelete type operations:
// 'findOneAndDelete'
// 'findOneAndRemove'

