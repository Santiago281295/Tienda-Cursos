var mysql = require('mysql');
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

module.exports = connection;