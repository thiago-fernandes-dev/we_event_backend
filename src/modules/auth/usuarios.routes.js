const usuariosControllers = require('./usuarios.controllers');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../shared/auth');

router.post('/cadastros', usuariosControllers.registrarUsuariosController);
router.post('/login', usuariosControllers.loginController);
router.get('/usuarios', authMiddleware, usuariosControllers.buscarUsuariosController);

module.exports = router;