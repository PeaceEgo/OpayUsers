const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authMiddleware = require('../middlewares/userAuth');
const upload = require('../middlewares/uploads');

router.post('/api/v1/register', userController.createUser);
router.post('/api/v1/login', userController.loginUser);
router.put('/api/v1/update/:id', authMiddleware, upload.single('profilePicture'), userController.updateUser);

module.exports = router;
