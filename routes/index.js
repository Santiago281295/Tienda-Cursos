var express = require('express');
var router = express.Router();
var db = require('../db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/carrito', function(req, res, next) {
  res.render('carrito', { title: 'Express' });
});

router.get('/usuarios', function(req, res, next) {
  res.render('usuarios', { title: 'Express' });
});

 /*Rutas Del Backend*/

router.get('/Back', function(req, res, next) {

	db.query('SELECT * FROM usuarios', function(err, results) {
		if (err){
			console.log(err);

			throw err;
		}

        for (var i = 0; i <= results.length - 1; i++) {
        	console.log(results[0].IDUsuario);
        	console.log(results[0].Nombre);
        	console.log(results[0].Apellido);
        	console.log(results[0].Correo);
        	console.log(results[0].Contrasena);
        }
    })

    db.end();

	res.render('Back/index', { title: 'Express' });
});

router.get('/Back/productos', function(req, res, next) {
  res.render('Back/productos', { title: 'Express' });
});

module.exports = router;
