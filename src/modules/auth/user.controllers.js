const userServices = require('./user.services');

exports.createUserController = async (req, res) => {
    try{
        const { nome, email, senha } = req.body;

        if ( !nome || !email || !senha ) {
            return res.status(400).json({
                error: 'Campos obrigatórios não fornecidos por completo.'
            });
        }

        const newUser = await userServices.createUser( nome, email, senha);

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            newUser
        });
    } catch (error) {
        console.error('Erro ao tentar criar o usuário.');
        res.status(500).json('Erro interno do servidor.');
    }
};

exports.getUsersController = async( req, res ) => {
    try{
        const users = await userServices.getUsers();

        res.status(200).json({users});
    } catch (error){
        console.error('Erro ao acessar os usuários no banco de dados.');
        res.status(500).json('Erro interno do servidor')
    }
};

exports.loginController = async ( req, res ) => {
    try{
        const { email, senha } = req.body;

        if ( !email || !senha ){
            return res.status(400).json({
                error: 'Campos obrigatórios não fornecidos por completo.'
            });
        }

        const login = await userServices.login( email, senha );

        res.status(200).json({
            message: 'Login realizado com sucesso.',
            user: login.findUser,
            token: login.jwtUserKey
        });

    } catch (error){
        console.error('Erro ao realizar login no sistema.');
        res.status(500).json('Erro interno no servidor.')
    }
};

exports.deleteUserController = async ( req, res ) => {
    try{
        const id = parseInt(req.params.id);

        await userServices.deleteUser(id);

        res.status(200).json({ message: 'Usuário deletado com sucesso.' })
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.updateUserController = async ( req, res ) => {
    try{
        const id = parseInt(req.params.id);
        const { nome, email ,senha } = req.body;

        const updatedUser = await userServices.updateUser( id, nome, email, senha );

        res.status(200).json({ message: 'Usuário atualizado com sucesso.', updatedUser })
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};