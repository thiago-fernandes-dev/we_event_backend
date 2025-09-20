require("dotenv").config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3450;

app.use(express.json());
const usuariosRoutes = require('./modules/usuarios/usuarios.routes');
const usuariosAuthRoutes = require('./modules/auth/usuarios.routes');
app.use('/api', usuariosRoutes);
app.use('/api/auth', usuariosAuthRoutes);

app.listen(PORT, ()=>{
    console.log(`servidor rodando em http://localhost:${PORT}`);
});