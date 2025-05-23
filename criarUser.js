const mongoose = require('mongoose');
const userModel = require('./models/user');

mongoose.connect('mongodb+srv://guilherme216361:esmeralda2701@cluster0.wqawz.mongodb.net/tarefasDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createUser(nome, senha, admin = false) {
  try {
    const novoUsuario = new userModel({
      nome: nome,
      senha: senha,  // senha em texto, será hasheada automaticamente no pre-save
      admin: admin
    });

    await novoUsuario.save();
    console.log(`Usuário criado com sucesso: ${nome}`);
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

// Exemplo de uso:
createUser('Admin', 'Admin', true);
