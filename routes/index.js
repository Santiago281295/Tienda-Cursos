var express = require('express');
var router = express.Router();
var db = require('../models/db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  global.dirHost = req.get('host');

  db.query('SELECT * FROM productos WHERE Status=1 ORDER BY IDProducto DESC LIMIT 5; SELECT * FROM productos WHERE Status=1 ORDER BY TotVendidos DESC LIMIT 5', function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }

    res.render('index', { title: 'Wdemii-Inicio', queryNuevos: results[0], queryExitos: results[1] });
  });
});

router.get('/login', function(req, res, next) {
  global.dirHost = req.get('host');
  if(global.logueado) {
    res.redirect('/');
  } else {
    res.render('login', { title: 'Wdemii-Inicias Sesión' });
  }
});

router.post('/login', function (req, res, next) {
  var correo = req.body.txtCorreo;
  var contrasena = req.body.txtContrasena;
  // global.usuario = null;

  db.query('SELECT * FROM Usuarios WHERE Correo=? AND Contrasena=? AND Status=1 LIMIT 1', [correo, contrasena], function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }

    if(results.length == 1) {
      global.id = results[0].IDUsuario;
      global.usuario = results[0].Correo;
      global.logueado = true;
      global.sessionerror = false;
      global.nombreUsuario = results[0].Nombre;
      global.fotousuario = results[0].Foto;

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
  global.dirHost = req.get('host');
  if (global.logueado) {
    res.redirect('/');
  } else {
    res.render('registro', { title: 'Wdemii-Registro' });
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

      fileName = 'profile_' + correo + '_' + fileName;
    } catch(err) {
      fileName = 'default.png';
      console.log(err);
    }
  } else {
    fileName = 'default.png';
  }

  db.query('INSERT INTO usuarios (Nombre, Apellido, Correo, Contrasena, Foto, TipoUsu, Cliente, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellido, correo, contrasena, fileName, 'Usuario', 0, 1], function(err, results) {
    try {
      global.usuario = correo;
      global.logueado = true;

      res.redirect('/');
    } catch(err) {
      res.redirect('/registro');
    }
  });
});

router.get('/logout', function(req, res, next) {
  global.dirHost = req.get('host');
  global.sessionerror = false;
  global.logueado = false;
  global.usuario = null;

  res.redirect('/login');
});

router.get('/carrito/', function(req, res, next) {
  global.dirHost = req.get('host');
  /*if (global.logueado) {
    res.render('carrito', { title: 'Wdemii-Carrito de Compras' });
  } else {*/
    res.redirect('/login');
  /*}*/
});

router.get('/carrito/:id', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    res.render('carrito', { title: 'Wdemii-Carrito de Compras' });
  } else {
    res.redirect('/login');
  }
});

router.get('/acerca_de', function(req, res, next) {
  global.dirHost = req.get('host');
  res.render('acerca_de', { title: 'Wdemii-Acerca de...' });
})

router.get('/cursos', function(req, res, next) {
  global.dirHost = req.get('host');
  res.render('cursos', { title: 'Wdemii-Nuestros cursos' });
})

 /*Rutas Del Backend*/

 /*
if (global.logueado) {
  if (global.usuario == 'aurelio16.mex@gmail.com') {
  } else {
    res.redirect('/');
  }
} else {
  res.redirect('/login');
}
 */

router.get('/Back', function(req, res, next) {
  global.dirHost = req.get('host');
  console.log(req);
	if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      res.render('Back/index', { title: 'Wdemii-Administrador' });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
});

router.get('/Back/cursos', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      db.query('SELECT * FROM productos WHERE Status=1', function(err, results) {
        if (err){
          console.log(err);

          throw err;
        }

        res.render('Back/cursos/index', { title: 'Wdemii-Gestión de Cursos', queryCursos: results });
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
});

router.get('/Back/curso_nuevo', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      res.render('Back/cursos/create', { title: 'Wdemii-Agregar Cursos' });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
})

router.post('/Back/curso_nuevo', function(req, res, next) {
  var titulo = req.body.txtTitulo;
  var descripcion = req.body.txtDescripcion;
  var precio = req.body.txtPrecio;
  var stock = req.body.txtStock;
  var tecnologia = req.body.txtTecnologia;
  var autor = req.body.txtAutor;
  var fileNameImg = '';
  var fileNamePdf = '';
  var pathFilesImg = './public/img/libros/cover_page';
  var pathFilesPdf = './public/bookFiles/book';
  var fullPathImg = pathFilesImg + '_';
  var fullPathPdf = pathFilesPdf + '_';

  if (req.files) {
    try {
      // Image
      fileNameImg = req.files.fileFoto.name;
      let imgToSave = req.files.fileFoto;
   
      // Use the mv() method to place the file somewhere on your server
      imgToSave.mv(fullPathImg + fileNameImg, function(err) {
        if (err) {
          console.log('<imgError>');
          console.log(err);
          console.log('</imgError>');
        }

        console.log('Archivo guardado.');
      });

      fileNameImg = 'cover_page' + '_' + fileNameImg;

      // PDF
      fileNamePdf = req.files.fileLibro.name;
      let pdfToSave = req.files.fileLibro;
   
      // Use the mv() method to place the file somewhere on your server
      pdfToSave.mv(fullPathPdf + fileNamePdf, function(err) {
        if (err) {
          console.log('<pdfError>');
          console.log(err);
          console.log('</pdfError>');
        }

        console.log('Libro guardado.');
      });

      fileNamePdf = 'book_' + fileNamePdf;
    } catch(err) {
      fileNameImg = 'default.png';
      fileNamePdf = 'default.png';
      console.log(err);
    }
  } else {
    fileNameImg = 'default.png';
    fileNamePdf = 'default.png';
  }

  db.query('INSERT INTO productos (Titulo, Descripcion, Precio, Stock, Imagen, Libro, Tecnologia, Autor, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [titulo, descripcion, precio, stock, fileNameImg, fileNamePdf, tecnologia, autor, 1], function(err, results) {
    try {
      res.redirect('/Back/cursos');
    } catch(err) {
      res.redirect('/Back/curso_nuevo');
    }
  });
})

router.get('/Back/curso_editar/:id', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      var id = req.params.id;

      db.query('SELECT * FROM productos WHERE IDProducto=? AND Status=1', id, function(err, results) {
        if (err){
          console.log(err);

          throw err;
        }
        res.render('Back/cursos/edit', { title: 'Wdemii-Editar Cursos', queryEdit: results });
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
})

router.post('/Back/curso_editar/:id', function(req, res, next) {
  var id = req.body.txtId;
  var titulo = req.body.txtTitulo;
  var descripcion = req.body.txtDescripcion;
  var precio = req.body.txtPrecio;
  var stock = req.body.txtStock;
  var tecnologia = req.body.txtTecnologia;
  var autor = req.body.txtAutor;
  var fileNameImg = '';
  var fileNamePdf = '';
  var pathFilesImg = './public/img/libros/cover_page';
  var pathFilesPdf = './public/bookFiles/book';
  var fullPathImg = pathFilesImg + '_';
  var fullPathPdf = pathFilesPdf + '_';
  /*var fileName = '';
  var pathFiles = './public/img/usuarios/profile_';
  var fullPath = pathFiles + correo + '_';*/

  if (req.files) {
    try {
      // Image
      try {
        fileNameImg = req.files.fileFoto.name;
      } catch(err) {
        fileNameImg = req.body.txtImagen;
      }
      try {
        fileNamePdf = req.files.fileLibro.name;
      } catch(err) {
        fileNamePdf = req.body.txtLibro;
      }
      let imgToSave = req.files.fileFoto;
   
      // Use the mv() method to place the file somewhere on your server
      try {
        imgToSave.mv(fullPathImg + fileNameImg, function(err) {
        if (err) {
          console.log('<imgError>');
          console.log(err);
          console.log('</imgError>');
        }

          console.log('Archivo guardado.');
        });

        fileNameImg = 'cover_page' + '_' + fileNameImg;
      } catch(err) {
        fileNameImg = req.body.txtImagen;
      }

      // PDF
      // fileNamePdf = req.files.fileLibro.name;
      let pdfToSave = req.files.fileLibro;
   
      // Use the mv() method to place the file somewhere on your server
      try {
        pdfToSave.mv(fullPathPdf + fileNamePdf, function(err) {
        if (err) {
          console.log('<pdfError>');
          console.log(err);
          console.log('</pdfError>');
        }

          console.log('Libro guardado.');
        });

        fileNamePdf = 'book_' + fileNamePdf;
      } catch(err) {
        fileNamePdf = req.body.txtLibro;
      }

    } catch(err) {
      // fileNameImg = req.body.txtImagen;
      // fileNamePdf = req.body.txtLibro;
      console.log(err);
    }
  } else {
    fileNameImg = req.body.txtImagen;
    fileNamePdf = req.body.txtLibro;
  }

  db.query('UPDATE productos set Titulo=?, Descripcion=?, Precio=?, Stock=?, Imagen=?, Libro=?, Tecnologia=?, Autor=?, Status=? WHERE IDProducto=?', [titulo, descripcion, precio, stock, fileNameImg, fileNamePdf, tecnologia, autor, 1, id], function(err, results) {
    try {
      res.redirect('/Back/cursos');
    } catch(err) {
      res.redirect('/Back/curso_editar/' + id);
    }
  });
})

router.get('/Back/curso_eliminar/:id', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      var id = req.params.id;

      db.query('UPDATE productos set Status=? WHERE IDProducto=?', [0, id], function(err, results) {
        if (err){
          console.log(err);

          throw err;
        }
        res.redirect('/Back/cursos');
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
})

router.get('/Back/usuarios', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      db.query('SELECT * FROM usuarios WHERE Status=1', function(err, results) {
        if (err){
          console.log(err);

          throw err;
        }
        res.render('Back/usuarios/index', { title: 'Wdemii-Gestión de Usuarios', queryUsuarios: results });
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
});

router.get('/Back/usuario_nuevo', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      res.render('Back/usuarios/create', { title: 'Wdemii-Agregar Usuarios' });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
})

router.post('/Back/usuario_nuevo', function(req, res, next) {
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

      fileName = 'profile_' + correo + '_' + fileName;
    } catch(err) {
      fileName = 'default.png';
      console.log(err);
    }
  } else {
    fileName = 'default.png';
  }

  db.query('INSERT INTO usuarios (Nombre, Apellido, Correo, Contrasena, Foto, TipoUsu, Cliente, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellido, correo, contrasena, fileName, 'Usuario', 0, 1], function(err, results) {
    try {
      res.redirect('/Back/usuarios');
    } catch(err) {
      res.redirect('/Back/usuario_nuevo');
    }
  });
})

router.get('/Back/usuario_editar/:id', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      var id = req.params.id;

      db.query('SELECT * FROM usuarios WHERE IDUsuario=? AND Status=1', id, function(err, results) {
        if (err){
          console.log(err);

          throw err;
        }
        res.render('Back/usuarios/edit', { title: 'Wdemii-Editar Usuarios', queryEdit: results });
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
})

router.post('/Back/usuario_editar/:id', function(req, res, next) {
  var id = req.body.txtId;
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

      fileName = 'profile_' + correo + '_' + fileName;
    } catch(err) {
      fileName = req.body.txtFoto;
      console.log(err);
    }
  } else {
    fileName = req.body.txtFoto;
  }

  db.query('UPDATE usuarios set Nombre=?, Apellido=?, Correo=?, Contrasena=?, Foto=?, TipoUsu=?, Cliente=?, Status=? WHERE IDUsuario=?', [nombre, apellido, correo, contrasena, fileName, 'Usuario', 0, 1, id], function(err, results) {
    try {
      res.redirect('/Back/usuarios');
    } catch(err) {
      res.redirect('/Back/usuario_editar/' + id);
    }
  });
})

router.get('/Back/usuario_eliminar/:id', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      var id = req.params.id;

      db.query('UPDATE usuarios set Status=? WHERE IDUsuario=?', [0, id], function(err, results) {
        if (err){
          console.log(err);

          throw err;
        }
        res.redirect('/Back/usuarios');
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
})

router.get('/Back/clientes', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      db.query('SELECT * FROM usuarios WHERE Cliente=1 AND Status=1', function(err, results) {
        if (err){
          console.log(err);

          throw err;
        }
        res.render('Back/usuarios/clientes', { title: 'Wdemii-Nuestros Clientes', queryUsuarios: results });
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
})

module.exports = router;