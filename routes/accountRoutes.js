const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

module.exports = (io) => {
    router.post('/friend-request', (req, res) => accountController.FriendRequest(req, res, io));
    router.post('/accept-friend-request', (req, res) => accountController.AcceptFriendRequest(req, res, io));
    return router;
};
