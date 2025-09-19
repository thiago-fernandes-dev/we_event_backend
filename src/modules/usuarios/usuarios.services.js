const usuariosServices = require('../../baseDados/tempDados');
let fakeId = 4;

const getAllUsuarios = ()=>{
    return usuariosServices;
}

const getUsuarioId = (id) => {
    const user = usuariosServices.find((user) => user.id === id);
    if (!user) {
        console.log('não encontrado');
    }
    return user
};

const criarUsuario = (nome, email, senha)=>{
    usuariosServices.push({id: fakeId++, nome, email, senha});
    return usuariosServices;
};

const deletarUsuario = (id)=>{
  const indiceUsuario = usuariosServices.findIndex((user)=>user.id === id);
  if(indiceUsuario === -1){
      console.log('usuario nao encontrado');
      return;
  }
  usuariosServices.splice(indiceUsuario, 1);
};

const atualizarUsuario = (id, nome, email, senha)=>{
    const usuario = usuariosServices.find((user)=>user.id === id);
    if(!usuario){
        console.log('usuario nao encontrado');
        return;
    }else{
        usuario.nome = nome || usuario.nome;
        usuario.preco = email || usuario.email;
        usuario.descricao = senha || usuario.senha;
    }
};

module.exports = {
    getAllUsuarios, getUsuarioId, criarUsuario,deletarUsuario, atualizarUsuario,
};