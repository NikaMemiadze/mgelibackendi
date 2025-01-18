const userRoutes = require('../routes/authRoutes');
const accountRoutes = require('../routes/accountRoutes');
const profileRoutes = require('../routes/profileRoutes')
const Authenticate = require('../utils/Authenticate')

const configureRoutes = (app, io) => {
    app.use('/api/auth', userRoutes);
    app.use('/api/account', Authenticate, accountRoutes(io)); 
    app.use('/api/profile', Authenticate, profileRoutes);
};

module.exports = configureRoutes;
