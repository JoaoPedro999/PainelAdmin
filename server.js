require('dotenv').config();
const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const app = express();

app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true if using https
}));

// Configurar o diretório de views e o motor de views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/pages'));
app.use(express.static(__dirname + '/partials'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/demo'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(path.join(__dirname, '/css')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rota para página inicial
app.get('/', (req, res) => {
  res.render('pages/index');
});

// Rota para dashboard
app.get('/dashboard', (req, res) => {
  res.render('pages/dashboard');
});

// Rota para login
app.get('/login', (req, res) => {
  res.render('pages/login');
});

// Rota para registro
app.get('/registro', (req, res) => {
  res.render('pages/register');
});

// Rota para tabelas
app.get('/tables', (req, res) => {
  res.render('pages/tables');
});

// Rota para logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
    console.log('Desconectado')
  });
});

// Rotas da API
// Rota para listar todos os usuários
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Rota para obter um único usuário por ID
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter usuário' });
  }
});

// Rota para criar um novo usuário
app.post('/api/users', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password
      }
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Rota para atualizar um usuário
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { username, email, password }
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Rota para deletar um usuário
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
