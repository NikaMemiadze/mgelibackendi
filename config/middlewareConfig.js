const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const configureMiddleware = (app) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(
        cors({
            origin: '*', 
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
        })
    );

    app.use(bodyParser.json());
};

module.exports = configureMiddleware;
