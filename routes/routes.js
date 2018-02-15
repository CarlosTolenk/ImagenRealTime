var usuario = require('../controllers/usuario');
var imagen = require('../controllers/imagen');


var rutas = function(app){

	app.get('/registro', function (req, res){
		res.render('registro');
	});

	app.get('/', function (req, res){
		res.render('login');
	});


	app.get('/home', function (req, res){
		res.render('home', {
			usuario : req.session.passport.user.nombre
		});
	});

	app.get('/upload', function (req, res){
		res.render('upload',{
			usuario : req.session.passport.user.nombre
		});
	});

	app.get('/galery' , imagen.readImagen, function(req, res){
			 imagen = req.body.imagenes;
			 res.send(imagen);
	});

	app.get('/error', function (req, res){
		res.send(req.session.flash.error[0]);
	});


	app.post('/registro', usuario.registro, function(req, res){
		res.redirect('/');
	});

	app.post('/upload', imagen.uploadImagen, function (req, res, next) {
		res.redirect('/home');
	});

};

module.exports = rutas;
