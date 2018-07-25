/*var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'proyectopaypal'
});

connection.connect(function(err) {
    if (err) {
    	console.log(err);

    	throw err;
    } else {
    	console.log('Connected');
    }
});

module.exports = connection;*/

var mysql = require('mysql');
port = process.env.PORT || 4205;

if (port == 4205) {
    var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'proyectopaypal',
        insecureAuth: true
    });
} else {
    console.log("No hay Conexión");
}

connection.connect(function(err) {
    if (err) {
        console.log('<Connection Error>');
        console.log(err);
        console.log('</Connection Error>');

        throw err;
    } else {
        console.log('Connected');
    }
});

module.exports = connection;