const comprasService = require('./compras.services.js');

exports.usuarioIdCompraController = async (req, res)=>{
    try{
        const id = parseInt(req.params.id);
        const { imagemCompra, nomeCompra } = req.body;
        const compra = await comprasService.usuarioIdCompra(id, imagemCompra, nomeCompra);
        (compra) ? res.status(200).json(compra) : res(404).json({message: "A compra nao foi encontrada."});
    }catch (error){
        res.status(500).json({message: "Server Internal Error"});
    }
};

exports.deletarUsuarioIdCompraController = async (req, res)=> {
    try{
        const { idCompra } = req.body;
        await comprasService.deletarUsuarioIdCompra(idCompra);
        res.status(200).json({message: "Compra deletada com sucesso!"});
    }catch (error) {
        res.status(500).json({message: "Server Internal Error"});
    }
};

exports.buscarUsuarioIdComprasController = async (req, res)=> {
    try{
        const id = parseInt(req.params.id);
        const compras = await comprasService.buscarUsuarioIdCompras(id);
        (compras) ? res.status(200).json({message: "Listagem de compras feita com sucesso!", compras: compras}) : res(404).json({message: "As compras nao foram encontradas."});
    }catch (error) {
        res.status(500).json({message: "Server Internal Error"});
    }
};
