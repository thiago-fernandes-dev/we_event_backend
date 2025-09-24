require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../db/prisma');
const logger = require('../shared/logger/logger');

const JWT_SECRET_KEY = process.env.JWT_SECRET;

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
        const existeUsuario = await prisma.usuarios.findUnique({ where: { email }})
        if (existeUsuario) {
            logger.warn(`Usuario ja cadastrado ${email}`);
            throw new Error('Usuario ja cadastrado na aplicacao.');
        }

        logger.info('Inicio do processo de cadastro do usuario.');
        // criptografando a senha do usuario.
        const cryptPassword = await bcrypt.hash(senha, 10);

        // adicionando o usuario
        const novoUsuario = await prisma.usuarios.create({
            data: {
                name: nome,
                email,
                senha: cryptPassword,
            },
        });

        // gerando o JWT
        const token = jwt.sign(
            {id: novoUsuario.id, email: novoUsuario.email, nome: novoUsuario.name},
            JWT_SECRET_KEY,
            {expiresIn: '40min'}
        );
        logger.info('Usuario cadastrado com sucesso.', {nome, email});
        return { novoUsuario, token };
    } catch (error) {
        logger.error('Erro ao cadastrar usuario', {
            error: error.message,
            email
        });
        throw error
    }
}

exports.buscarUsuarios = async () => {
    try {
        const usuarios = await prisma.usuarios.findMany();
        if(!usuarios){
            logger.warn(`A lista de usuarios nao foi encontrada.`);
            throw new Error('Erro na busca por usuarios.');
        }
        logger.info(`Usuarios encontrados com sucesso. Qtde: ${usuarios.length}`);
        return usuarios;
    } catch (error) {
        logger.error('Erro ao buscar os usuarios', {
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
        const existeUsuario = await prisma.usuarios.findUnique({ where: { email }})
        if (!existeUsuario) {
            logger.error(`Usuario nao encontrado ${email}`);
            throw new Error('Usuario nao encontrado no sistema.');
        } else {
            logger.info(`Usuario encontrado: ${existeUsuario.name}:${existeUsuario.email}`);
        }
        // comparando as senhas
        const validSenha = await bcrypt.compare(senha, existeUsuario.senha);
        if (!validSenha) {
            logger.error(`Senha invalida!`);
            throw new Error('Senha invalida para este usuario.');
        }

        const token = jwt.sign(
            {id: existeUsuario.id, email: existeUsuario.email, nome: existeUsuario.name},
            JWT_SECRET_KEY,
            {expiresIn: '40min'}
        );

        return {existeUsuario, token};
    } catch (error) {
        logger.error('Error ao tentar fazer o login do usuario', {
            error: error.message,
            email
        });
        throw error
    }
};