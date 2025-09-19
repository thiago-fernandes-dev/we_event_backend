const usuarios = require('../../baseDados/tempDados');
let fakeId = 4;

const getAllUsuarios = ()=>{
    return usuarios;
}

const getUsuarioId = (id) => {
    const user = usuarios.find((user) => user.id === id);
    if (!user) {
        console.log('não encontrado');
    }
    return user
};

const criarUsuario = (nome, email, senha)=>{
    usuarios.push({id: fakeId++, nome, email, senha});
    return usuarios;
};

const deletarUsuario = (id)=>{
  const indiceUsuario = usuarios.findIndex((user)=>user.id === id);
  if(indiceUsuario === -1){
      console.log('usuario nao encontrado');
      return;
  }
  usuarios.splice(indiceUsuario, 1);
};

const atualizarUsuario = (id, nome, email, senha)=>{
    const usuario = usuarios.find((user)=>user.id === id);
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