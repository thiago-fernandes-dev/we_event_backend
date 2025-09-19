const usuariosControllers = require('./usuarios.controllers');
const express = require('express');
const router = express.Router();

router.get('/usuarios', usuariosControllers.getUsuariosController);
router.get('/usuarios/:id', usuariosControllers.getUsuarioIdController);
router.post('/usuarios', usuariosControllers.criarUsuarioController);
router.delete('/usuarios/:id', usuariosControllers.deletarUsuarioController);
router.put('/usuarios/:id', usuariosControllers.atualizarUsuarioController);

module.exports = router;