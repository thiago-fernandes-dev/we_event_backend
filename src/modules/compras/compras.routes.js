const comprasControllers = require('./compras.controllers');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../shared/auth');

router.delete('/usuarios/:id/del', authMiddleware, comprasControllers.deletarUsuarioIdCompraController);
router.post('/usuarios/buy/:id', authMiddleware, comprasControllers.usuarioIdCompraController);
router.get('/usuarios/list/:id', authMiddleware, comprasControllers.buscarUsuarioIdComprasController);

module.exports = router;