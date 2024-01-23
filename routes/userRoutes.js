const express = require('express');
const UserController = require('../controllers/userController');
const { registerValidator, loginValidator } = require('../validators/userValidator');
const router = express.Router();

router.post('/login', loginValidator, UserController.login);
router.post('/register', registerValidator, UserController.registerUser);
router.post('/auth', registerValidator, UserController.auth);

module.exports = router;