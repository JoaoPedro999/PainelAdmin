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
app.get('/', async (req, res) => {
  try {
    const projects = await prisma.project_Primary_Registers.findMany();
    res.render('pages/index', { projects });
  } catch (err) {
    console.error('Erro ao buscar registros:', err);
    res.status(500).send('Erro ao buscar registros');
  }
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
