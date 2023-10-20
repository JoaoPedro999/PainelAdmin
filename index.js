const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'aluno',
  database: 'mydb'
});

app.get('/', (req, res) => {
  res.render('index');
  }); 
/* app.get('/tables', (req, res) => {
    res.render('tables');
    }); */

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/demo'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/css')); 

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// READ
app.get('/tables', (req, res) => {
  db.query('SELECT * FROM consultas', (err, result) => {
    if (err) throw err;
    res.render('tables', { consultas: result });
  });
});



app.listen(3002, () => {
  console.log('Servidor rodando na porta 3001');
  });