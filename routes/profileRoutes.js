const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

module.exports = (io) => {
    router.post('/change-name', (req, res) => profileControllerController.changeName(req, res, io));
    return router;
};
