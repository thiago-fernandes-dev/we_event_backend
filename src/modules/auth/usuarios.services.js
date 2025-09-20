require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarios = require('../../baseDados/tempUsers');

const JWT_SECRET_KEY = process.env.JWT_SECRET;
let IDUsuario = 2;

exports.registrarUsuario = async (nome, email, senha) => {
    try {
        if (!nome || !email || !senha) {
            throw new Error('nome ou email ou password não encontrados.');
        }
        if (senha.length >= 6) {
            throw new Error('senha deve possuir pelo menos 6 digitos');
        }
        // verificar se usuário já existe na base de dados.
        const user = usuarios.find((user) => user.email === email);
        if (user) {
            throw new Error('Usuário já cadastrado na aplicação.');
        }

        // criptografando a senha do usuário.
        const cryptPassword = await bcrypt.hash(senha, 10);

        // adicionando o usuario
        const novoUsuario = {
            id: IDUsuario++,
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
        console.log('usuario cadastrado com sucesso');
        return { novoUsuario, token };
    } catch (error) {
        console.log(`erro ao cadastrar usuario: ${error}`);
        throw error
    }
}

exports.buscarUsuarios = () => {
    try {
        return usuarios;
    } catch (error) {
        console.log(`erro ao buscar usuarios: ${error}`);
        throw error
    }
};

exports.login = async (email, senha) => {
    try {
        if (!email || !senha) {
            throw new Error('email ou password não encontrados.');
        }
        // procurando o usuário
        const usuarioLogin = usuarios.find((user) => user.email === email);
        if (!usuarioLogin) {
            throw new Error('Usuário não encontrado no sistema.');
        }
        // comparando as senhas
        const validSenha = await bcrypt.compare(senha, usuarioLogin.senha);
        if (!validSenha) {
            throw new Error('Senha não válida para este usuário.');
        }

        const token = jwt.sign(
            {id: usuarioLogin.id, email: usuarioLogin.email, nome: usuarioLogin.nome},
            JWT_SECRET_KEY,
            {expiresIn: '40min'}
        );

        return {usuarioLogin, token};
    } catch (error) {
        console.log('erro ao cadastrar o usuario');
        throw error
    }
};