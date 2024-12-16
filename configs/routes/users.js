const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authMiddleware = require('../middlewares/userAuth');
const upload = require('../middlewares/multerConfig');

// User Registration
router.post('/api/v1/register', userController.createUser);

// User Login
router.post('/api/v1/login', userController.loginUser);

// Update User 
router.patch('/api/v1/update/:userId', upload.single('profilePicture'), userController.updateUser);

// Fetch User by ID
router.get('/api/v1/user/:userId', authMiddleware, userController.getUser);

// Fetch User by Account Number 
router.get('/api/v1/user/account/:accountNumber', userController.fetchUserByAccountNumber);

router.post('/api/v1/user/account/:accountNumber', userController.fetchUserByAccountNumber);

// Set Transaction PIN 
router.patch('/api/v1/user/:userId/transaction-pin', authMiddleware, userController.setTransactionPin);

module.exports = router;
