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

router.post('/login', function (req, res, next) {
  var correo = req.body.txtCorreo;
  var contrasena = req.body.txtContrasena;
  var administrador = '';

  db.query('SELECT * FROM Usuarios WHERE Correo=? AND Contrasena=? LIMIT 1', [correo, contrasena], function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }

    if(results.length == 1) {
      if(results[0].Correo == 'aurelio16.mex@gmail.com') {
        administrador = 't';

      } else {
        administrador = 'f';
      }
    }
  });
  
  if(administrador == 't') {
    res.redirect('/Back');
  } else {
    if(administrador == 'f') {
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } 
    
});

router.get('/carrito', function(req, res, next) {
  res.render('carrito', { title: 'Express' });
});

router.get('/usuarios', function(req, res, next) {
  res.render('usuarios', { title: 'Express' });
});

 /*Rutas Del Backend*/

router.get('/Back', function(req, res, next) {
	res.render('Back/index', { title: 'Express' });
});

router.get('/Back/productos', function(req, res, next) {
  res.render('Back/productos', { title: 'Express' });
});

module.exports = router;
