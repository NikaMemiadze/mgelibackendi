const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    friendRequests: [
        {
            _id: false,
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            displayName: { type: String, required: true }
        }
    ],
    friends: [
        {
            _id: false,
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            displayName: { type: String, required: true }
        }
    ],
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);