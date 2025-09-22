const usuariosServices = require('../../baseDados/tempDados');
let fakeId = 4;
const logger = require('../shared/logger/logger');

const getAllUsuarios = ()=>{
    try{
        logger.info('Usuários listados com sucesso', { count: usuariosServices.length });
        return usuariosServices;
    }catch (error){
        logger.error('Error ao acessar os usuários', { error: error.message });
        throw error;
    }
}

const getUsuarioId = (id) => {
    try{
        const usuario = usuariosServices.find((user) => user.id === id);
        if (!usuario) {
            logger.warn('usuário não encontrado', { id });
            return null;
        }
        logger.info('Usuário encontrado com sucesso.', { id });
        return usuario;
    }catch (error){
        logger.error('Error ao buscar o usuário', { error: error.message });
        throw error;
    }
};

const criarUsuario = (nome, email, senha)=>{
    try {
        usuariosServices.push({id: ++fakeId, nome, email, senha});
        logger.info('Usuário criado com sucesso.', {id: usuariosServices.id});
        return usuariosServices;
    }catch (error){
        logger.error('Error ao criar um usuário', { error: error.message });
        throw error;
    }
};

const deletarUsuario = (id)=>{
    try{
        const indiceUsuario = usuariosServices.findIndex((user)=>user.id === id);
        if(indiceUsuario === -1){
            console.log('usuario nao encontrado');
            return;
        }
        usuariosServices.splice(indiceUsuario, 1);
        logger.info('Usuário deletado com sucesso.', { id });
        return true;
    }catch (error){
        logger.error('Error ao deletar um usuário', { error: error.message });
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
        logger.info('Usuário Atualizado com sucesso.', { id });
        return usuario;
    }catch (error){
        logger.error('Error ao atualizar o usuário', { error: error.message });
        throw error;
    }
};

module.exports = {
    getAllUsuarios, getUsuarioId, criarUsuario,deletarUsuario, atualizarUsuario,
};