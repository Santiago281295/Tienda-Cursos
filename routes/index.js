var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var db = require('../models/db.js');

// PayPal Configuration
// var IPNController = require('../models/ipn_ctrl.js');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AaSrItp0ysNRZ6VlT1qmvSJIcNEbknkGwD-KId5Xsi2Xbp4fbvrkFlteWSDY9e7ZFYvSK4IkqPbqrrhn',
  'client_secret': 'EHFWePkM3b-a8Lh27kqj780aMn8uEFwHQH3joAArPkrQmgQs27Ni6tpc4SrG2Bag9XpoaWvRpYkOnwzg'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  global.dirHost = req.get('host');
  db.query('SELECT * FROM productos WHERE Status=1 AND Stock>=1 ORDER BY IDProducto DESC LIMIT 5; SELECT * FROM productos WHERE Status=1 AND Stock>=1 ORDER BY TotVendidos DESC LIMIT 5', function(err, results) {
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
      var idUsu = results[0].IDUsuario;
      global.id = results[0].IDUsuario;
      global.usuario = results[0].Correo;
      global.logueado = true;
      global.sessionerror = false;
      global.nombreUsuario = results[0].Nombre;
      global.fullNombre = results[0].Nombre + ' ' + results[0].Apellido;
      global.fotousuario = results[0].Foto;

      // db.query("SELECT COUNT(*) AS 'Articulos' FROM Carrito WHERE FKUsuario=?", idUsu, function(err, results) {
      //   if (err){
      //     console.log(err);

      //     throw err;
      //   }

      //   global.Articulos = results[0].Articulos;
      // });

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
  var idUsu = req.params.id;

  if (global.logueado) {
    db.query('SELECT C.*, P.*, U.Nombre, U.Correo, U.Foto FROM Carrito C INNER JOIN Productos P ON C.FKProducto=P.IDProducto INNER JOIN Usuarios U ON C.FKUsuario=U.IDUsuario WHERE U.IDUsuario=? AND U.Status=1;', id, function(err, results) {
      var totalCompra = 0;
      var vacio = true;

      if(results.length > 0) {
        vacio = false;
      }

      for (var i = 0; i < results.length; i++) {
        totalCompra = totalCompra + results[i].Precio;
      }
      res.render('carrito', { title: 'Wdemii-Carrito de Compras', queryCarrito: results, nombreUsuario: fullNombre, correoUsuario: usuario, fotoUsuario: fotousuario, totalCompra: totalCompra, vacio: vacio });
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/remove/:id', function(req, res, next) {
  if (global.logueado) {
    var idCarrito = req.params.id;

    db.query('DELETE FROM Carrito WHERE IDCarrito=?', idCarrito, function(err, results) {
      if (err){
        console.log(err);

        throw err;
      }

      res.redirect('/carrito/' + global.id);
    });
  } else {
    res.redirect('/login');
  }
})

router.get('/acerca_de', function(req, res, next) {
  global.dirHost = req.get('host');
  res.render('acerca_de', { title: 'Wdemii-Acerca de...' });
})

router.get('/cursos', function(req, res, next) {
  global.dirHost = req.get('host');

  db.query('SELECT * FROM productos WHERE Status=1 AND Stock >= 1 ORDER BY IDProducto DESC', function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }

    res.render('cursos', { title: 'Wdemii-Nuestros cursos', queryCursos: results });
  });
})

router.get('/cursos/:id', function(req, res, next) {
  global.dirHost = req.get('host');
  var id = req.params.id;

  db.query("SELECT * FROM productos WHERE IDProducto=? AND Status=1; SELECT cxp.Comentario, CONCAT(u.Nombre, ' ', u.Apellido) AS Usuario FROM comentariosproductos cxp INNER JOIN usuarios u ON cxp.FKUsuario=u.IDUsuario INNER JOIN productos p ON cxp.FKProducto=p.IDProducto WHERE cxp.FKProducto=? ORDER BY cxp.IDComent DESC;", [id, id], function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }
    res.render('curso_detalle', { title: 'Wdemii-Detalles del Curso', queryDetalle: results[0], queryComentarios: results[1] });
  });
})

router.post('/cursos/:id', function(req, res, next) {
  global.dirHost = req.get('host');
  if (global.logueado) {
    var idproductoselec = req.params.id;
    var comentario = req.body.txtComentario;
    var idusuariolog = global.id;

    db.query("INSERT INTO comentariosproductos (Comentario, FKUsuario, FKProducto) VALUES (?, ?, ?);", [comentario, idusuariolog, idproductoselec], function(err, results) {
      if (err){
        console.log(err);

        throw err;
      }
      res.redirect('/cursos/' + idproductoselec);
  });
  } else {
    res.redirect('/login');
  }
})

router.get('/busqueda', function(req, res, next) {
  global.dirHost = req.get('host');

  db.query("SELECT * FROM productos WHERE Status=1 AND Stock >= 1 AND Titulo LIKE '%%' ORDER BY IDProducto DESC", function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }

    res.render('busqueda', { title: 'Wdemii-Resultados de la busqueda', queryCursos: results });
  });
})

router.get('/busqueda/:cadena', function(req, res, next) {
  global.dirHost = req.get('host');
  var busqueda = "%" + req.params.cadena + "%";

  db.query('SELECT * FROM productos WHERE Status=1 AND Stock >= 1 AND Titulo LIKE ? ORDER BY IDProducto DESC', [busqueda, busqueda], function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }

    res.render('busqueda', { title: 'Wdemii-Resultados de la busqueda', queryCursos: results });
  });
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

router.get('/Back/ventas', function(req, res, next) {
  if (global.logueado) {
    if (global.usuario == 'aurelio16.mex@gmail.com') {
      db.query('SELECT B.*, P.IDProducto, P.Titulo, P.Precio FROM Bitacora B INNER JOIN Productos P ON B.FKProducto=P.IDProducto ORDER BY B.Fecha DESC', function(err, results) {
        if (err){
          console.log(err);

          throw err;
        }

        res.render('Back/ventas', { title: 'Wdemi-Bitacora de Ventas', queryBitacora: results })
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
})

router.post('/Back/ventas', function(req, res, next) {
  var fecha = req.body.txtFecha;

  db.query('SELECT B.*, P.IDProducto, P.Titulo, P.Precio FROM Bitacora B INNER JOIN Productos P ON B.FKProducto=P.IDProducto WHERE B.Fecha>=? ORDER BY B.Fecha DESC', fecha, function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }

    res.render('Back/filtro_ventas', { title: 'Wdemi-Bitacora de Ventas', queryBitacora: results })
  });
})

/* Rutas de PayPal */

router.post('/pay', function(req, res) {
  var id = req.body.txtID;
  global.idToPay = id;

  if (global.logueado) {
    db.query('SELECT * FROM productos WHERE Status=1 AND Stock>=1 AND IDProducto=? ORDER BY IDProducto DESC LIMIT 1', id, function(err, results) {
      if (err){
        console.log(err);

        throw err;
      }

      var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
            // "return_url": "https://tienda-cursos.herokuapp.com/success",
            // "cancel_url": "https://tienda-cursos.herokuapp.com/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": results[0].Titulo,
                    "sku": results[0].IDProducto,
                    "price": results[0].Precio,
                    "currency": "MXN",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "MXN",
                "total": results[0].Precio
            },
            "description": "Prodcutos comprados en Wdemii."
        }]
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            // console.log("Create Payment Response");
            // console.log(payment);
            // res.send('test');
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === 'approval_url') {
                res.redirect(payment.links[i].href);
              }
            }
        }
      });
    });
  } else {
    res.redirect('/login');
  }
})

router.post('/carrito/:id', function(req, res) {
  var id = req.params.id;
  global.idCUToPay = id;

  if (global.logueado) {
    db.query('SELECT C.*, P.*, U.Nombre, U.Correo, U.Foto FROM Carrito C INNER JOIN Productos P ON C.FKProducto=P.IDProducto INNER JOIN Usuarios U ON C.FKUsuario=U.IDUsuario WHERE U.IDUsuario=? AND U.Status=1;', id, function(err, results) {
      if (err){
        console.log(err);

        throw err;
      }

      var lstProductos = 'Productos: \n';
      var skuFinal = '';
      var precioTotal = 0;

      for (var i = 0; i < results.length; i++) {
        lstProductos = lstProductos + results[i].Titulo + ', ';
        skuFinal = skuFinal + results[i].IDProducto + '&';
        precioTotal = precioTotal + results[i].Precio;
      }

      var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/cart-success",
            "cancel_url": "http://localhost:3000/cancel"
            // "return_url": "https://tienda-cursos.herokuapp.com/cart-success",
            // "cancel_url": "https://tienda-cursos.herokuapp.com/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": lstProductos,
                    "sku": skuFinal,
                    "price": precioTotal,
                    "currency": "MXN",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "MXN",
                "total": precioTotal
            },
            "description": "Prodcutos comprados en Wdemii."
        }]
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          console.log(error);
            throw error;
        } else {
            // console.log("Create Payment Response");
            // console.log(payment);
            // res.send('test');
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === 'approval_url') {
                res.redirect(payment.links[i].href);
              }
            }
        }
      });
    });
  } else {
    res.redirect('/login');
  }
})

router.get('/success', function(req, res) {
  var id = global.idToPay;
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  var date = new Date();
  var fecha = date.getFullYear() +'-' + (date.getMonth() + 1) +'-' + date.getDate();

  db.query('SELECT * FROM productos WHERE Status=1 AND Stock>=1 AND IDProducto=? ORDER BY IDProducto DESC LIMIT 1', id, function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }

    var execute_payment_json = {
      "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "MXN",
                "total": results[0].Precio
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        console.log('payment success');

        var StockP = results[0].Stock - 1;
        var totVendidos = results[0].TotVendidos + 1;
        var Libro = results[0].Libro;

        db.query('UPDATE productos SET Stock=?, TotVendidos=? WHERE Status=1 AND Stock>=1 AND IDProducto=?', [StockP, totVendidos, id], function(err, results) {
          if (err){
            console.log(err);

            throw err;
          }

          db.query('INSERT INTO Bitacora(Cantidad, Fecha, FKProducto) values (?, ?, ?);', [1, fecha, id], function(err, results) {
            if (err){
              console.log(err);

              throw err;
            }

            res.render('buyed', { title: 'Wdemii-Compra exitosa', payerId: payerId, paymentId: paymentId, book: Libro })
          });
        });

        db.query('UPDATE Usuarios SET Cliente=1 WHERE IDUsuario=?', global.id, function(err, results) {
          if (err){
            console.log(err);

            throw err;
          }
        });
      }
    });
  });
})

router.get('/cart-success', function(req, res) {
  var id = global.idCUToPay;
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  var date = new Date();
  var fecha = date.getFullYear() +'-' + (date.getMonth() + 1) +'-' + date.getDate();
  var idProductos = [];
  var StockP = [];
  var totVendidos = [];
  var Libro = [];

  db.query('SELECT C.*, P.*, U.Nombre, U.Correo, U.Foto FROM Carrito C INNER JOIN Productos P ON C.FKProducto=P.IDProducto INNER JOIN Usuarios U ON C.FKUsuario=U.IDUsuario WHERE U.IDUsuario=? AND U.Status=1;', id, function(err, results) {
    if (err){
      console.log(err);

      throw err;
    }

    var precioTotal = 0;

    for (var i = 0; i < results.length; i++) {
      precioTotal = precioTotal + results[i].Precio;
    }

    var execute_payment_json = {
      "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "MXN",
                "total": precioTotal
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        console.log('payment success');

        // var StockP = results[0].Stock - 1;
        // var totVendidos = results[0].TotVendidos + 1;
        // var Libro = results[0].Libro;
        // var idProductos = [];
        // var StockP = [];
        // var totVendidos = [];
        // var Libro = [];

        for (var i = 0; i < results.length; i++) {
          idProductos.push(results[i].IDProducto);
          StockP.push(results[i].Stock - 1);
          totVendidos.push(results[i].TotVendidos + 1);
          Libro.push(results[i].Libro);
        }

        // console.log(StockP);
        // console.log(totVendidos);
        // console.log(Libro);

        for (var i = 0; i < results.length; i++) {
          db.query('UPDATE productos SET Stock=?, TotVendidos=? WHERE Status=1 AND Stock>=1 AND IDProducto=?', [StockP[i], totVendidos[i], idProductos[i]], function(err, results) {
            if (err){
              console.log(err);

              throw err;
            }
          });

          db.query('INSERT INTO Bitacora(Cantidad, Fecha, FKProducto) values (?, ?, ?);', [1, fecha, idProductos[i]], function(err, results) {
            if (err){
              console.log(err);

              throw err;
            }
          });
        }

        db.query('UPDATE Usuarios SET Cliente=1 WHERE IDUsuario=?', global.id, function(err, results) {
          if (err){
            console.log(err);

            throw err;
          }

          db.query('DELETE FROM Carrito WHERE FKUsuario=?', global.id, function(err, results) {
            if (err) {
              console.log(err);
              throw err;
            }

            res.render('cart-buyed', { title: 'Wdemii-Compra exitosa', payerId: payerId, paymentId: paymentId, books: Libro })
          });
        });
      }
    });
  });
})

router.get('/cancel', function(req, res) {
  try{
    const token = req.query.token;

    if (token.length > 0) {
      res.render('cancel', { title: 'Compra Cancelada' });
    } else {
      res.redirect('/');
    }
  } catch(err) {
    res.redirect('/');
  }
})

router.get('/add-to-cart/:id', function(req, res, next) {
  global.dirHost = req.get('host');
  var idProducto = req.params.id;

  if (global.logueado) {
    db.query('INSERT INTO Carrito(Cantidad, FKProducto, FKUsuario) VALUES (?, ?, ?)', [1, idProducto, global.id], function(err, results) {
      if (err){
        console.log(err);

        throw err;
      }

      res.redirect('/carrito/' + global.id);
    });
  } else {
    res.redirect('/login');
  }
})

module.exports = router;