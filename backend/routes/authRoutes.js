const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to handle user signup
// POST /api/auth/signup
router.post('/signup', authController.signup);

// Route to handle user login
// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
