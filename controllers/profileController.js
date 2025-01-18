const User = require('../models/User')

exports.changeName = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized'});
        }

        const newName = req.body.newName;

        if (!newName || newName.trim() === ''){
            return res.status(400).json({ error: 'New name cannot be empty' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name: newName},
            { new: true }
        )

        if(!user) {
            return res.status(404).json({ error: 'User not found'});
        }

        res.status(200).json({
            message: 'Name successfully changed',
            user: {
                id: user._id,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Error changing name:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}