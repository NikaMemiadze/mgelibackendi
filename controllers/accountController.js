const User = require('../models/User');

exports.FriendRequest = async (req, res, io) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return res.status(400).json({ error: 'Both senderId and receiverId are required' });
    }

    try {
        const senderObjectId = new mongoose.Types.ObjectId(senderId);
        const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

        const receiver = await User.findById(receiverObjectId);
        if (!receiver) {
            return res.status(404).json({ error: 'Receiver not found' });
        }

        if (receiver.friendRequests.includes(senderObjectId.toString())) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        receiver.friendRequests.push(senderObjectId);
        await receiver.save();

        io.emit('friendRequest', {
            senderId,
            receiverId,
            message: 'You have a new friend request!',
        });

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.AcceptFriendRequest = async (req, res, io) => {
    const { userId, senderId } = req.body;

    if (!userId || !senderId) {
        return res.status(400).json({ error: 'Both userId and senderId are required' });
    }

    try {
        const user = await User.findById(userId);
        const sender = await User.findById(senderId);

        if (!user || !sender) {
            return res.status(404).json({ error: 'User or sender not found' });
        }

        if (!user.friendRequests.includes(senderId)) {
            return res.status(400).json({ error: 'No friend request from this user' });
        }

        user.friendRequests = user.friendRequests.filter(id => id.toString() !== senderId);
        user.friends.push(senderId);
        sender.friends.push(userId);

        await user.save();
        await sender.save();

        io.emit('friendRequestAccepted', {
            userId,
            senderId,
            message: 'Your friend request has been accepted!',
        });

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
