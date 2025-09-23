require("dotenv").config();
const express = require('express');
const app = express();
const logger = require('./modules/shared/logger/logger');
const cors = require('cors');

const PORT = process.env.PORT || 3450;
const corsOptions = {
    origin: function (origin, callback){
        const recursoPermitido = ['http://localhost:5173'];
        if(!origin) return callback(null,true);
        if(recursoPermitido.indexOf(origin) !== -1){
            return callback(null, true);
        } else {
            logger.warn(`CORS bloqueou este recurso: ${origin}`);
            callback(new Error('Não permitido pelo CORS.'));
        }
    },
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: [
        'Content-type',
        'Authorization',
        'X-Correlation-ID',
        'Origin',
        'Accept',
        'autorizacao',
    ],
    exposedHeaders: ['X-Correlation-ID'],
}

app.use(express.json());
const usuariosRoutes = require('./modules/usuarios/usuarios.routes');
const usuariosAuthRoutes = require('./modules/auth/usuarios.routes');
const comprasRoutes= require('./modules/compras/compras.routes');
app.use('/api', usuariosRoutes);
app.use('/api/auth', usuariosAuthRoutes);
app.use('/api/compras', comprasRoutes);
app.use(cors(corsOptions));

logger.info(
    'Start Server Application', {
    environment: 'development',
    port: PORT
});

app.listen(PORT, ()=>{
    console.log(`servidor rodando em http://localhost:${PORT}`);
});