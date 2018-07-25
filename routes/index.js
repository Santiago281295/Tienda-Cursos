var express = require('express');
var router = express.Router();
var db = require('../models/db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  if(global.logueado) {
    res.redirect('/');
  } else {
    res.render('login', { title: 'Express' });
  }
});

router.post('/login', function (req, res, next) {
  var correo = req.body.txtCorreo;
  var contrasena = req.body.txtContrasena;
  global.usuario = null;

  db.query('SELECT * FROM Usuarios WHERE Correo=? AND Contrasena=? LIMIT 1', [correo, contrasena], function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }

    if(results.length == 1) {
      global.usuario = results[0].Correo;
      global.logueado = true;
      global.sessionerror = false;

      if(results[0].Correo == 'aurelio16.mex@gmail.com') {
        res.redirect('/Back');

      } else {
        res.redirect('/');
      }
    } else {
      global.usuario = correo;
      global.sessionerror = true;

      res.redirect('/login');
    }
  });
});

router.get('/logout', function(req, res, next) {
  global.sessionerror = false;
  global.logueado = false;
  global.usuario = null;

  res.redirect('/login');
});

router.get('/carrito', function(req, res, next) {
  if (global.logueado) {
    res.render('carrito', { title: 'Express' });
  } else {
    res.redirect('/login');
  }
});

router.get('/registro', function(req, res, next) {
  if (global.logueado) {
    res.redirect('/');
  } else {
    res.render('registro', { title: 'Express' });
  }
});

 /*Rutas Del Backend*/

router.get('/Back', function(req, res, next) {
	if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      res.render('Back/index', { title: 'Express' });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
});

router.get('/Back/productos', function(req, res, next) {
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      res.render('Back/productos', { title: 'Express' });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
