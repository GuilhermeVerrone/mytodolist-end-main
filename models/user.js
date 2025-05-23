const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  admin: { type: Boolean, default: false }
});

// Antes de salvar, hash da senha
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next(); // só hash se for nova ou alterada

  try {
    const salt = await bcrypt.genSalt(10); // Gera salt
    this.senha = await bcrypt.hash(this.senha, salt); // Gera hash + salt
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.senha);
};

module.exports = mongoose.model('User', userSchema);