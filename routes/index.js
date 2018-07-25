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

router.get('/registro', function(req, res, next) {
  if (global.logueado) {
    res.redirect('/');
  } else {
    res.render('registro', { title: 'Express' });
  }
});

router.post('/registro', function(req, res, next) {
  var nombre = req.body.txtNombre;
  var apellido = req.body.txtApellido;
  var correo = req.body.txtCorreo;
  var contrasena = req.body.txtContrasena;
  var fileName = '';
  var pathFiles = './public/img/usuarios/profile_';
  var fullPath = pathFiles + correo + '_';

  if (req.files) {
    try {
      fileName = req.files.fileFoto.name;
      let imgToSave = req.files.fileFoto;
   
      // Use the mv() method to place the file somewhere on your server
      imgToSave.mv(fullPath + fileName, function(err) {
        if (err) {
          console.log('<imgError>');
          console.log(err);
          console.log('</imgError>');
        }

        console.log('Archivo guardado.');
      });
    } catch(err) {
      console.log(err);
    }
  } else {
    fileName = 'default.png';
  }

  res.redirect('/registro');
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