const usuariosControllers = require('./usuarios.controllers');
const express = require('express');
const router = express.Router();

router.post('/cadastros', usuariosControllers.registrarUsuariosController);
router.post('/login', usuariosControllers.loginController);
router.get('/usuarios', usuariosControllers.buscarUsuariosController);

module.exports = router;