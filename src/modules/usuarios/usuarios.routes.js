const usuariosControllers = require('./usuarios.controllers');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../shared/auth');

router.get('/usuarios', authMiddleware, usuariosControllers.getUsuariosController);
router.get('/usuarios/:id', authMiddleware, usuariosControllers.getUsuarioIdController);
router.post('/usuarios', usuariosControllers.criarUsuarioController);
router.delete('/usuarios/:id', authMiddleware, usuariosControllers.deletarUsuarioController);
router.put('/usuarios/:id', authMiddleware, usuariosControllers.atualizarUsuarioController);

module.exports = router;