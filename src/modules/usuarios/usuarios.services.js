const usuariosServices = require('../../baseDados/tempDados');
let fakeId = 4;
const logger = require('../shared/logger/logger');

const getAllUsuarios = ()=>{
    try{
        logger.info('Usuarios listados com sucesso', { count: usuariosServices.length });
        return usuariosServices;
    }catch (error){
        logger.error('Error ao acessar os usuarios', { error: error.message });
        throw error;
    }
}

const getUsuarioId = (id) => {
    try{
        const usuario = usuariosServices.find((user) => user.id === id);
        if (!usuario) {
            logger.warn('Usuario nao encontrado', { id });
            return null;
        }
        logger.info('Usuario encontrado com sucesso.', { id });
        return usuario;
    }catch (error){
        logger.error('Error ao buscar o usuario', { error: error.message });
        throw error;
    }
};

const criarUsuario = (nome, email, senha)=>{
    try {
        usuariosServices.push({id: ++fakeId, nome, email, senha});
        logger.info('Usuario criado com sucesso.', {id: usuariosServices.id});
        return usuariosServices;
    }catch (error){
        logger.error('Error ao criar um usuario', { error: error.message });
        throw error;
    }
};

const deletarUsuario = (id)=>{
    try{
        const indiceUsuario = usuariosServices.findIndex((user)=>user.id === id);
        if(indiceUsuario === -1){
            logger.info('Usuario nao encontrado.', { id });
            return;
        }
        usuariosServices.splice(indiceUsuario, 1);
        logger.info('Usuario deletado com sucesso.', { id });
        return true;
    }catch (error){
        logger.error('Error ao deletar um Usuario', { error: error.message });
        throw error;
    }
};

const atualizarUsuario = (id, nome, email, senha)=>{
    try{
        const usuario = usuariosServices.find((user)=>user.id === id);
        if(!usuario){
            console.log('usuario nao encontrado');
            return;
        }else{
            usuario.nome = nome || usuario.nome;
            usuario.email = email || usuario.email;
            usuario.senha = senha || usuario.senha;
        }
        logger.info('Usuario Atualizado com sucesso.', { id });
        return usuario;
    }catch (error){
        logger.error('Erro ao atualizar o usuario', { error: error.message });
        throw error;
    }
};

module.exports = {
    getAllUsuarios, getUsuarioId, criarUsuario,deletarUsuario, atualizarUsuario,
};