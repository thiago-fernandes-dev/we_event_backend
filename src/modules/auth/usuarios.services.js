require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarios = require('../../baseDados/tempUsers');
const logger = require('../shared/logger/logger');

const JWT_SECRET_KEY = process.env.JWT_SECRET;
let IDUsuario = 1;

if (!JWT_SECRET_KEY) {
    logger.error('JWT SECRET nao carregado!');
    throw new Error('JWT SECRET nao encontrado nas variaveis de ambiente.');
}

exports.registrarUsuario = async (nome, email, senha) => {
    try {
        if (!nome || !email || !senha) {
            logger.error('nome, email e senha são obrigatorios');
            throw new Error('nome ou email ou password nao encontrados.');
        }
        if (senha.length <= 5) {
            logger.error('senha deve possuir pelo menos 6 digitos');
            throw new Error('senha deve possuir pelo menos 6 digitos');
        }
        // verificar se usuario já existe na base de dados.
        const user = usuarios.find((user) => user.email === email);
        if (user) {
            logger.warn(`Usuario ja cadastrado ${email}`);
            throw new Error('Usuario ja cadastrado na aplicacao.');
        }

        logger.info('Inicio do processo de cadastro do usuario.');
        // criptografando a senha do usuario.
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
        logger.info('Usuario cadastrado com sucesso.', {nome, email});
        return { novoUsuario, token };
    } catch (error) {
        logger.error('Error ao cadastrar usuario', {
            error: error.message,
            email
        });
        throw error
    }
}

exports.buscarUsuarios = () => {
    try {
        logger.info('Usuarios listados com sucesso.', {count: usuarios.lenght});
        return usuarios;
    } catch (error) {
        logger.error('Error ao buscar os usuarios', {
            error: error.message,
        });
        throw error
    }
};

exports.login = async (email, senha) => {
    try {
        if (!email || !senha) {
            logger.error('email e senha são obrigatorios');
            throw new Error('email ou password não encontrados.');
        }
        // procurando o usuario
        const usuarioLogin = usuarios.find((user) => user.email === email);
        if (!usuarioLogin) {
            logger.error(`Usuario nao encontrado ${usuarioLogin}`);
            throw new Error('Usuario nao encontrado no sistema.');
        }
        // comparando as senhas
        const validSenha = await bcrypt.compare(senha, usuarioLogin.senha);
        if (!validSenha) {
            logger.error(`Senha invalida!`);
            throw new Error('Senha invalida para este usuario.');
        }

        const token = jwt.sign(
            {id: usuarioLogin.id, email: usuarioLogin.email, nome: usuarioLogin.nome},
            JWT_SECRET_KEY,
            {expiresIn: '40min'}
        );

        return {usuarioLogin, token};
    } catch (error) {
        logger.error('Error ao cadastrar usuario', {
            error: error.message,
            email
        });
        throw error
    }
};