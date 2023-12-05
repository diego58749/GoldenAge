const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const path = require('path');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
const axios = require('axios');


app.use(express.urlencoded({extended:false}));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

app.set('view engine','ejs');

const bcryptjs =  require('bcryptjs');


app.use(express.static(path.join(__dirname, '/')));
let conexionRegistro = mysql.createConnection({
    host: "localhost",
    database: "users",
    user: "root",
    password: ""
});

app.use(express.static(path.join(__dirname, '/')));
let conexionBD = mysql.createConnection({
    host: "localhost",
    database: "documents_users",
    user: "root",
    password: ""
});

app.use(session({
    secret: 'miSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  conexionBD.connect(error => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
        return;
    }
    console.log('Conectado a la base de datos MySQL documents');
});

conexionRegistro.connect(error => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
        return;
    }
    console.log('Conectado a la base de datos MySQL users');
});

app.get('/beneficios', (req, res) => {
    res.sendFile(path.join(__dirname, '/Beneficios.html'));
});

app.get('/inicio-de-sesion', (req, res) => {
    res.sendFile(path.join(__dirname, '/InicioDeSesion.html'));
});

app.get('/mis-documentos', (req, res) => {
    res.sendFile(path.join(__dirname, '/MisDocumentos.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '/Registro.html'));
});


app.get('/', (req, res) => {
    
    if (!req.session.loggedin){
        res.sendFile(path.join(__dirname, '/InicioDeSesion.html'));
    }
    else    
    {    
        res.sendFile(path.join(__dirname, '/index.html'));
    }
    

    
});
 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});
app.post('/registrar', async function(req, res) {
    console.log(req.body);
    const nombres = req.body.nombres;
    const correo = req.body.correo;
    const contraseña = req.body.contraseña;
    let passwordHaash = await bcryptjs.hash(contraseña,8);
    conexionRegistro.query('INSERT INTO registrousuarios SET ?', {nombre:nombres,correo:correo,contraseña:passwordHaash}, async(error, results)=>{
        if (error) {
            console.error('Error en la consulta:', error);
            res.status(500).send('Error al registrar el usuario');
            return;
        }
        res.send('Registro completado');
    });
});
// || !(await bcryptjs.compare(passwordHaash, results[0].contraseña))
//const conecction = require('./consultaInicio.js');

app.post('/loginsesion', async (req, res) => { 
  const correo = req.body.correo;
  const contraseña = req.body.contraseña;
  console.log(correo);
  console.log(contraseña);
    const strSQL = "SELECT * FROM registrousuarios WHERE correo =  '"+correo+"'";
    console.log(strSQL);
    let passwordHaash = await bcryptjs.hash(contraseña,8);
    conexionRegistro.query(strSQL, async (error, results, fields) => {
        
    if (results.length == 0 || !(await bcryptjs.compare(passwordHaash, results[0].contraseña))) {
      res.send('Inicio incorrecto');
    } else {
        //req.session.loggedin = true;

      res.send('LOGIN CORRECTO'); 
    }
    res.end();
  });
});

app.listen(443, () => {
    console.log('Servidor ejecutándose en el puerto 443');
});


// app.post('/cargar-archivo', upload.single('archivo'), function (req, res, next) {
//   var archivo = req.file;

//   var sql = "INSERT INTO documents (id, nombreDocumento, datosDocumento) VALUES (?, ?, ?)";
//   var values = [id, archivo.originalname, archivo.buffer];

//   con.query(sql, values, function (err, result) {
//     if (err) throw err;
//     console.log("Archivo cargado con éxito.");
//   });

//   res.send("Archivo cargado con éxito.");
// });

