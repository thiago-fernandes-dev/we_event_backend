const usuarioService = require('./usuarios.js');

exports.getUsuariosController = async (req,  res)=>{
    try{
        const usuarios = await usuarioService.getAllUsuarios();
        res.status(200).json(usuarios);
    }catch (error){
        res.status(500).json({message: "Server Internal Error"});
    }
};

exports.getUsuarioIdController = async (req, res)=>{
    try{
        const id = parseInt(req.params.id);
        const usuario = await usuarioService.getUsuarioId(id);
        (usuario) ? res.status(200).json(usuario) : res(404).json({message: "usuario nao encontrado"});
    }catch (error){
        res.status(500).json({message: "Server Internal Error"});
    }
};

exports.criarUsuarioController = async (req, res)=>{
    try{
        const { nome, email, senha} = req.body;
        await usuarioService.criarUsuario(nome, email, senha);
        res.status(200).json({message: "usuario criado com sucesso"});
    }catch (error) {
        res.status(500).json({message: "Server Internal Error"});
    }
};

exports.deletarUsuarioController = async (req, res)=> {
    try{
        const id = parseInt(req.params.id);
        await usuarioService.deletarUsuario(id);
        res.status(200).json({message: "usuario deletado com sucesso"});
    }catch (error) {
        res.status(500).json({message: "Server Internal Error"});
    }
};

exports.atualizarUsuarioController = async (req, res)=>{
    try{
        const id = parseInt(req.params.id);
        const { nome, email, senha} = req.body;
        await usuarioService.atualizarUsuario(id, nome, email, senha);
        res.status(200).json({message: "usuario atualizado com sucesso"});
    }catch (error){
        res.status(500).json({message: "Server Internal Error"});
    }
};