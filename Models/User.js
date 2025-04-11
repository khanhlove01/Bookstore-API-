const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user","admin"],
        default: "user"
    },
    refreshToken: {
        token: { type: String },
        expiresAt: { type: Date }
    }
},{timestamps: true}) //Adds createdAt & updatedAt

const User = mongoose.model("User",UserSchema);
module.exports = User;