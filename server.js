require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true if using https
}));

// Configurar a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida.');
});

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

app.get('/', (req, res) => {
  res.render('pages/index');
}); 

app.get('/login', (req, res) => {
  res.render('pages/login'); // Renders views/login.ejs
});


app.get('/tables', (req, res) => {
  res.render('pages/tables'); // Renders views/login.ejs
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
  const { username, password, cpf } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = SHA1(?) AND cpf = ?';

  db.query(query, [username, password, cpf], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // Autenticação bem-sucedida
      req.session.loggedin = true;
      req.session.name = username;

      // Verifique o tipo de usuário
      const tipoUsuario = results[0].tipo;

      req.session.tipoUsuario = tipoUsuario

      if (tipoUsuario === 'user') {
        console.log("Usuario Logado");
        res.redirect('/agendamento')
        req.session.loggedin = true;
        req.session.name = username;
      } else if (tipoUsuario === 'Medico') {
        console.log("Usuario Logado");
        res.redirect('/medicopage')
        req.session.loggedin = true;
        req.session.name = username;
      } else if (tipoUsuario === 'Gestor') {
        console.log("Usuario Logado");
        res.redirect('/gestorpage')
        req.session.loggedin = true;
        req.session.name = username;
      } else if (tipoUsuario === 'Administrador') {
        console.log("Usuario Logado");
        res.redirect('/indexadmin')
        req.session.loggedin = true;
        req.session.name = username;
      } else {
        // Tratamento para outros tipos de usuário ou tipo desconhecido
        res.send('Tipo de usuário desconhecido. <a href="/">Tente novamente</a>');
      }
    } else {
      // Credenciais incorretas
      res.send('<h1>Credenciais Incorretas');
    }
  });
});

// Rota para fazer logout
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
