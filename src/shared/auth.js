require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_KEY = process.env.SECRET_JWT_KEY;

const verifyToken = ( ( req, res, next ) => {
    try {
        const verifyHeader = req.headers['authorization'];
        const jwtKey = verifyHeader && verifyHeader.split(' ')[1];

        if (!jwtKey) {
            console.error(`Token não foi encontrada. Negando acesso. ${verifyHeader}, ${jwtKey}`);
            return res.status(401).json({
                error: 'Entrada não autorizada!'
            });
        }

        jwt.verify( jwtKey, JWT_KEY, ( error, user ) => {
            if (error) {
                console.error('Token inválida.');
                return res.status(403).json({
                    error: 'Token expirada ou inválida.',
                    jwtKey,
                    verifyHeader
                });
            }

            req.user = user;
            console.log('ID: ', req.user.id);
            console.log('Nome: ', req.user.name);
            console.log('E-mail: ', req.user.email);
            next();
        })
    } catch (error) {
        console.error(`Erro na verificação e autenticação do token ${error}`);
        res.status(500).json({
            error: 'Erro interno do servidor!'
        });
    }
});

module.exports = verifyToken;