require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET

const autenticarToken = (req, res, next) => {
    try {
        const authCabecalho = req.headers['autorizacao'];
        const token = authCabecalho && authCabecalho.split(' ')[1];

        if (!token) {
            console.error('Token não fornecida! Acesso negado!');
            return res.status(401).json({
                error: 'Não autorizado!'
            })
        }

        jwt.verify(token, JWT_SECRET_KEY, (error, user) => {
            if (error) {
                console.error('Token inválida!');
                return res.status(403).json({
                    error: 'token inválida ou expirada!'
                });
            }

            req.user = user;
            console.log('Usuário autorizado!');
            console.log('ID: ', req.user.id);
            console.log('nome: ', req.user.nome);
            console.log('email', req.user.email);
            next();
        })

    } catch (error) {
        console.error(`Erro na autenticação da token`);
        res.status(500).json({
            error: 'Erro interno do servidor!'
        });
    }
};

module.exports = autenticarToken;