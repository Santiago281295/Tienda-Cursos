var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('Back/login', { title: 'Express' });
});

 /*Rutas Del Backend*/

router.get('/Back', function(req, res, next) {
  res.render('Back/index', { title: 'Express' });
});

module.exports = router;
