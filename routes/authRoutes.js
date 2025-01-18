const express = require('express');
const authController = require('../controllers/authController')

const passport = require('passport')

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/google', authController.googleAuth);
router.get('/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/login',  
        session: false,              
    }), 
    (req, res) => {
        res.redirect('/dashboard');
    }
);

router.get('/twitter', authController.twitterAuth);
router.get('/twitter/callback', 
    passport.authenticate('twitter', {
        failureRedirect: '/login',  
        session: false,              
    }), 
    (req, res) => {
        res.redirect('/dashboard');
    }
);

module.exports = router;