var mysql = require('mysql');
port = process.env.PORT || 4205;

if (port == 4205) {
    /*var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'proyectopaypal',
        insecureAuth: true
    });*/
    var connection = mysql.createConnection({
        host: 'cursosutm.mysql.database.azure.com',
        port: 3306,
        user: 'Santiago@cursosutm',
        password: 'Alpha281295@',
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