const usuarioServices = require('./usuarios.services');

exports.registrarUsuariosController = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                error: 'campos obrigatorios incompletos'
            });
        }

        const novoUsuario = await usuarioServices.registrarUsuario(nome, email, senha);

        res.status(200).json({
            message: 'Usuario registrado com sucesso!',
            novoUsuario
        });
    } catch (error) {
        console.error(`Erro ao tentar cadastrar um Usuario.`);
        res.status(500).json('Erro Interno do Servidor.')
    }
};

exports.loginController = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                error: 'campos obrigatorios incompletos - email ou senha'
            });
        }

        const result = await usuarioServices.login(email, senha);

        res.status(200).json({
            message: 'login realizado com sucesso.',
            user: result.existeUsuario,
            token: result.token
        });
    } catch (error) {
        console.error(`Erro ao tentar logar na aplicacao.`);
        res.status(500).json('Erro Interno do Servidor.');
    }
};

exports.buscarUsuariosController = (req, res) => {
    try {
        const usuarios = usuarioServices.buscarUsuarios();
        res.status(200).json({
            usuarios
        });
    } catch (error) {
        console.error(`Erro ao acessar os usuarios.`);
        res.status(500).json('Erro Interno do Servidor.');
    }
};