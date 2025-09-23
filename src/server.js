require("dotenv").config();
const express = require('express');
const app = express();
const logger = require('./modules/shared/logger/logger');

const PORT = process.env.PORT || 3450;

app.use(express.json());
const usuariosRoutes = require('./modules/usuarios/usuarios.routes');
const usuariosAuthRoutes = require('./modules/auth/usuarios.routes');
const comprasRoutes= require('./modules/compras/compras.routes');
app.use('/api', usuariosRoutes);
app.use('/api/auth', usuariosAuthRoutes);
app.use('/api/compras', comprasRoutes);

logger.info(
    'Start Server Application', {
    environment: 'development',
    port: PORT
});

app.listen(PORT, ()=>{
    console.log(`servidor rodando em http://localhost:${PORT}`);
});