const mysql = require('mysql');

const conecction = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

conecction.connect((error)=>{
    if(error){
        console.log('El error de conexion es: '+error);
        return;
    }else{
        console.log('conectado a la base de datos');

    }
    
});

module.exports = conecction;

