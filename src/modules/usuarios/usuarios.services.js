const prisma = require('../db/prisma');
const logger = require('../shared/logger/logger');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET;

if (!JWT_SECRET_KEY) {
    logger.error('JWT SECRET nao carregado!');
    throw new Error('JWT SECRET nao encontrado nas variaveis de ambiente.');
}

const buscarTodosUsuarios = async ()=>{
    try {
        const usuarios = await prisma.usuarios.findMany();
        if(!usuarios){
            logger.warn(`A lista de usuarios nao foi encontrada.`);
            throw new Error('Erro na busca por usuarios.');
        }
        logger.info(`Usuarios encontrados com sucesso. Qtde: ${usuarios.length}`);
        return usuarios;
    } catch (error) {
        logger.error('Error ao buscar os usuarios', {
            error: error.message,
        });
        throw error
    }
}

const buscarUsuarioId = async(id) => {
    try{
        const usuario = await prisma.usuarios.findUnique(
            {
                where:{
                    id: id
                }
            }
        );
        if (!usuario) {
            logger.warn(`Usuario nao encontrado com esse id: ${id}`);
            return null;
        }
        logger.info(`Usuario encontrado com sucesso: id:${usuario.id} - nome: ${usuario.name} - email: ${usuario.email}`);
        return usuario;
    }catch (error){
        logger.error(`Error ao buscar esse usuario - ${error.message}`);
        throw error;
    }
};

const criarUsuario = async (nome, email, senha)=>{
    try {
        if (!nome || !email || !senha) {
            logger.error('nome, email e senha são obrigatorios');
            throw new Error('nome ou email ou senha nao encontrados.');
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
        logger.info(`Usuario cadastrado com sucesso. nome: ${nome} email: ${email}`);
        return { novoUsuario, token };
    } catch (error) {
        logger.error(`Erro ao cadastrar usuario - ${error.message}`);
        throw error
    }
};

const deletarUsuario = async (id)=>{
    try{
        const existeUsuario = await prisma.usuarios.findUnique({where: {id: id} })
        if(!existeUsuario){
            logger.info(`Usuario nao encontrado com esse id: ${id}`);
            throw new Error('Nao e possivel deletar esse usuario.');
        }
        await prisma.usuarios.delete({where: {id: id}})
        logger.info(`Usuario de id: ${id} deletado com sucesso.`);
        return true;
    }catch (error){
        logger.error(`Erro ao  deletar esse usuario - ${error.message}`);
        throw error;
    }
};

const atualizarUsuario = async (id, nome, email, senha)=>{
    try{
        let existeUsuario = await prisma.usuarios.findUnique({where: {id} })
        if(!existeUsuario){
            logger.info(`Usuario nao encontrado com esse id: ${id}`);
            throw new Error('Nao e possivel atualizar esse usuario.');
        } else{
            const cryptPassword = await bcrypt.hash(senha, 10);
            await prisma.usuarios.update({
            where: {id},
            data: {
                name: nome || existeUsuario.name,
                email: email || existeUsuario.email,
                senha: cryptPassword || existeUsuario.senha
            }
                }
            )
        }
        existeUsuario = await prisma.usuarios.findUnique({where: {id} })
        logger.info(`Usuario Atualizado com sucesso. id: ${existeUsuario.id} - nome: ${existeUsuario.name} - email: ${existeUsuario.email}`);
        return existeUsuario;
    }catch (error){
        logger.error(`Erro ao atualizar o usuario - ${error.message}`);
        throw error;
    }
};

module.exports = {
    buscarTodosUsuarios, buscarUsuarioId, criarUsuario,deletarUsuario, atualizarUsuario,
};