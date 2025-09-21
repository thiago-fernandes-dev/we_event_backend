const usersControllers = require('./user.controllers');
const authMiddleware = require('../../shared/auth');
const express = require('express');
const router = express.Router();

router.post('/create', usersControllers.createUserController);
router.post('/login', usersControllers.loginController);
router.get('/users', authMiddleware, usersControllers.getUsersController);
router.delete('/delete/:id', authMiddleware, usersControllers.deleteUserController);
router.put('/users/:id', authMiddleware, usersControllers.updateUserController);

module.exports = router;