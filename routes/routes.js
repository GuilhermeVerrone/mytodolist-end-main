const express = require("express");
const router = express.Router();
module.exports = router;
const modeloTarefa = require("../models/tarefa");

router.post("/post", async (req, res) => {
  const objetoTarefa = new modeloTarefa({
    descricao: req.body.descricao,
    statusRealizada: req.body.statusRealizada,
  });
  try {
    const tarefaSalva = await objetoTarefa.save();
    res.status(200).json(tarefaSalva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/getAll", verificaJWT, async (req, res) => {
  try {
    const resultados = await modeloTarefa.find();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const novaTarefa = req.body;
    const options = { new: true };
    const result = await modeloTarefa.findByIdAndUpdate(
      id,
      novaTarefa,
      options
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

function verificaUsuarioSenha(req, res, next) {
  const nome = req.body?.nome || req.query?.nome || req.headers["x-nome"];
  const senha = req.body?.senha || req.query?.senha || req.headers["x-senha"];

  if (!nome || !senha) {
    return res.status(400).json({ message: "Nome e senha são obrigatórios." });
  }

  if (nome !== 'branqs' || senha !== '1234') {
    return res.status(401).json({ auth: false, message: 'Usuário ou senha incorreta' });
  }

  next();
}
const jwt = require("jsonwebtoken");

// LOGIN - gera token JWT
//Segunda forma de Autenticacao - Busca usuário no BD e compara senha
const userModel = require('../models/user');
router.post('/login', async (req, res) => {
 try {
 const data = await userModel.findOne({ 'nome': req.body.nome });

 if (data != null && data.senha === req.body.senha) {
 const token = jwt.sign({ id: req.body.user }, 'segredo',
 { expiresIn: 300 });
 return res.json({ token: token });
 }

 res.status(500).json({ message: 'Login invalido!' });
 } catch (error) {
 res.status(500).json({ message: error.message })
 }
})

// Middleware de verificação JWT
function verificaJWT(req, res, next) {
  const token = req.headers["id-token"];

  if (!token) {
    return res.status(401).json({ auth: false, message: "Token não fornecido." });
  }

  jwt.verify(token, "segredo", (err, decoded) => {
    if (err) {
      return res.status(401).json({ auth: false, message: "Token inválido ou expirado." });
    }
    req.usuario = decoded.nome;
    next();
  });
}

router.post("/users", verificaJWT, verificaAdmin, async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ
router.get("/users", verificaJWT, verificaAdmin, async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.patch("/users/:id", verificaJWT, verificaAdmin, async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete("/users/:id", verificaJWT, verificaAdmin, async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuário deletado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;