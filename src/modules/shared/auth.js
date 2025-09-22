require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('./logger/logger');

const JWT_SECRET_KEY = process.env.JWT_SECRET

const autenticarToken = (req, res, next) => {
    try {
        const authCabecalho = req.headers['autorizacao'];
        const token = authCabecalho && authCabecalho.split(' ')[1];

        if (!token) {
            logger.error('Token nao fornecida! Acesso negado!');
            return res.status(401).json({
                error: 'Nao autorizado!'
            })
        }

        jwt.verify(token, JWT_SECRET_KEY, (error, user) => {
            if (error) {
                logger.error('Token invalida!');
                return res.status(403).json({
                    error: 'token invalida ou expirada!'
                });
            }

            req.user = user;
            console.log('Usuario autorizado!');
            console.log('ID: ', req.user.id);
            console.log('nome: ', req.user.nome);
            console.log('email', req.user.email);
            next();
        })

    } catch (error) {
        logger.error(`Erro na autenticacao da token`, error);
        res.status(500).json({
            error: 'Erro interno do servidor!'
        });
    }
};

module.exports = autenticarToken;