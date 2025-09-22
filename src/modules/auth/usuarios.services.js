require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarios = require('../../baseDados/tempUsers');
const logger = require('../shared/logger/logger');

const JWT_SECRET_KEY = process.env.JWT_SECRET;
let IDUsuario = 1;

if (!JWT_SECRET_KEY) {
    logger.error('JWT SECRET não carregado!');
    throw new Error('JWT SECRET não encontrada nas variáveis de ambiente.');
}

exports.registrarUsuario = async (nome, email, senha) => {
    try {
        if (!nome || !email || !senha) {
            logger.error('nome, email e senha são obrigatórios');
            throw new Error('nome ou email ou password não encontrados.');
        }
        if (senha.length <= 5) {
            logger.error('senha deve possuir pelo menos 6 digitos');
            throw new Error('senha deve possuir pelo menos 6 digitos');
        }
        // verificar se usuário já existe na base de dados.
        const user = usuarios.find((user) => user.email === email);
        if (user) {
            logger.warn(`Usuário já cadastrado ${email}`);
            throw new Error('Usuário já cadastrado na aplicação.');
        }

        logger.info('Início do processo de cadastro do usuário.');
        // criptografando a senha do usuário.
        const cryptPassword = await bcrypt.hash(senha, 10);

        // adicionando o usuario
        const novoUsuario = {
            id: ++IDUsuario,
            nome,
            email,
            senha: cryptPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active'
        };
        usuarios.push(novoUsuario);


        // gerando o JWT
        const token = jwt.sign(
            {id: novoUsuario.id, email: novoUsuario.email, nome: novoUsuario.nome},
            JWT_SECRET_KEY,
            {expiresIn: '40min'}
        );
        logger.info('Usuário cadastrado com Sucesso.', {nome, email});
        return { novoUsuario, token };
    } catch (error) {
        logger.error('Error ao cadastrar usuário', {
            error: error.message,
            email
        });
        throw error
    }
}

exports.buscarUsuarios = () => {
    try {
        logger.info('Usuários listados com sucesso.', {count: usuarios.lenght});
        return usuarios;
    } catch (error) {
        logger.error('Error ao buscar os usuários', {
            error: error.message,
        });
        throw error
    }
};

exports.login = async (email, senha) => {
    try {
        if (!email || !senha) {
            logger.error('email e senha são obrigatórios');
            throw new Error('email ou password não encontrados.');
        }
        // procurando o usuário
        const usuarioLogin = usuarios.find((user) => user.email === email);
        if (!usuarioLogin) {
            logger.error(`Usuário não encontrado ${usuarioLogin}`);
            throw new Error('Usuário não encontrado no sistema.');
        }
        // comparando as senhas
        const validSenha = await bcrypt.compare(senha, usuarioLogin.senha);
        if (!validSenha) {
            logger.error(`Senha inválida!`);
            throw new Error('Senha inválida para este usuário.');
        }

        const token = jwt.sign(
            {id: usuarioLogin.id, email: usuarioLogin.email, nome: usuarioLogin.nome},
            JWT_SECRET_KEY,
            {expiresIn: '40min'}
        );

        return {usuarioLogin, token};
    } catch (error) {
        logger.error('Error ao cadastrar usuário', {
            error: error.message,
            email
        });
        throw error
    }
};