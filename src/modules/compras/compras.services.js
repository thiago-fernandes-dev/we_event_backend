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

const usuarioIdCompra = async(id, imagemCompra, nomeCompra) => {
    try{
        const usuario = await prisma.usuarios.findUnique(
            {where:{id: id}
            }
        );
        if (!usuario) {
            logger.warn(`Usuario nao encontrado com esse id: ${id}, erro ao processar compra`);
            throw new Error('Nao e possivel realizar essa compra.');
        }
        const compra = await prisma.compras.create({
            data: {
                image: imagemCompra,
                descricao: nomeCompra,
                usuarioId: id,
            }
        })
        logger.info(`Compra realizada com sucesso: usuario id:${usuario.id} - nome: ${usuario.name} - email: ${usuario.email} - compra: ${nomeCompra}`);
        return compra;
    }catch (error){
        logger.error(`Error ao realizar essa compra para esse usuario - ${error.message}`);
        throw error;
    }
};

const deletarUsuarioIdCompra = async (idCompra)=>{
    try{
        /*const usuario = await prisma.usuarios.findUnique(
            {where:{id: id}
            }
        );
        if (!usuario) {
            logger.warn(`Usuario nao encontrado com esse id: ${id}, erro ao deletar compra`);
            throw new Error('Nao e possivel deletar essa compra.');
        }*/
        const compra = await prisma.compras.findUnique({where: {id: idCompra}});
        if (!compra) {
            logger.warn(`Compra de id: ${idCompra} nao encontrada, erro ao deletar compra`);
            throw new Error('Nao e possivel deletar essa compra.');
        }
        await prisma.compras.delete({where: {id: idCompra}});
        logger.info(`Compra de id: ${idCompra} deletada com sucesso.`);
        return true;
    }catch (error){
        logger.error(`Erro ao  deletar a compra desse usuario - ${error.message}`);
        throw error;
    }
};

const buscarUsuarioIdCompras = async (id) => {
    try {
        const compras = await prisma.compras.findMany( {where: {usuarioId: id}});
        if(!compras){
            logger.warn(`A lista de compras nao foi encontrada.`);
            throw new Error('Erro na busca por compras.');
        }
        logger.info(`Compras encontradas com sucesso. Qtde: ${compras.length}`);
        return compras;
    } catch (error) {
        logger.error('Error ao buscar as compras', {
            error: error.message,
        });
        throw error
    }
};

module.exports = {
    usuarioIdCompra, deletarUsuarioIdCompra, buscarUsuarioIdCompras
};