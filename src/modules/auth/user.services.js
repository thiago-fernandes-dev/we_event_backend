const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../db/prisma');
require('dotenv').config();

const JWT_KEY = process.env.SECRET_JWT_KEY;

if (!JWT_KEY){
    throw new Error('Chave JWT não encontrada nas variáveis do .env!');
}

exports.createUser = async ( nome, email, senha ) => {
    try{
        if ( !nome || !email || !senha ) {
            throw new Error('Campos para criação de usuário estão faltando');
        }
        if ( senha.length < 8 ) {
            throw new Error('Senha precisa ter no mínimo 8 caracteres');
        }

        const existingUser = await prisma.user.findUnique({ where: {email} });
        if (existingUser) {
            throw new Error('Usuário já existe no banco de dados.');
        }

        const cryptPassword = await bcrypt.hash(senha, 10);

        const newUser = await prisma.user.create({
            data: {
                name: nome,
                email: email,
                password: cryptPassword,
                updatedAt: new Date().toISOString()
            },
        });

        const jwtUserKey = jwt.sign(
            { id: newUser.id, email: newUser.email, nome: newUser.name },
            JWT_KEY,
            { expiresIn: '30min' }
        );

        console.log(`Usuário cadastrado ${nome} ${email}`);

        return{ newUser, jwtUserKey };
    } catch (error) {
        console.error(`Erro ao criar usuário: ${error}`);
        throw error
    }
};

exports.getUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        console.error(`Erro ao buscar usuários ${error}.`);
        throw error
    }
};

exports.login = async ( email, senha ) => {
    try{
        if ( !email || !senha ) {
            throw new Error('Faltam campos para verificação interna.');
        }

        const findUser = await prisma.user.findUnique({ where: {email} });
        if (!findUser) {
            throw new Error('Usuário inexistente no sistema.');
        }

        const validatePassword = await bcrypt.compare(senha, findUser.password);
        if (!validatePassword) {
            throw new Error('Senha incorreta deste usuário'); 
        }

        const jwtUserKey = jwt.sign(
            { id: findUser.id, email: findUser.email, name: findUser.name },
            JWT_KEY,
            { expiresIn: '30min' }
        );

        return{ findUser, jwtUserKey };
    } catch (error) {
        console.error(`Erro ao fazer login ${error}`);
        throw error
    }
};

exports.deleteUser = async (id) => {
    try{
        const idUser = parseInt(id);  
        const findUser = await prisma.user.findUnique({ where: {id: idUser} });

        if (!findUser) {
            throw new Error('Usuário inexistente');
        }

        await prisma.user.delete({ where: { id: idUser } });

        return true;
    } catch (error){
        console.error(`Falha ao deletar usuário ${error}`);
        throw error
    }
};

exports.updateUser = async ( id, nome, email ,senha ) => {
    try{
        const idUser = parseInt(id);
        const findUser = await prisma.user.findUnique({ where: {id: idUser} });

        if (!findUser){
            throw new Error('Usuário não encontrado no sistema.');
        }

        if(senha) {
            if(senha.length < 8){
                throw new Error('Sua nova senha deverá possuir no mínimo 8 caracteres');
            }
            var newPassword = await bcrypt.hash(senha,10)
        } else {
            var newPassword = findUser.password;
        }

        console.log(nome, email, senha);

        const updatedUser = await prisma.user.update({
            where: { id: idUser },
            data: {
                name: nome,
                email: email,
                password: newPassword,
                updatedAt: new Date().toISOString()
            }
        });

        return updatedUser;
    } catch (error) {
        console.error(`Erro ao atualizar usuário ${error}`);
        throw error
    }
}; 