const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }
    
    try {
        const decoded = jwt.verify(token, 'your_secret_key'); 
        req.user = decoded; 
        next(); 
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
