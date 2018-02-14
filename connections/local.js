const passport = require('passport'),
	   	passportLocal = require('passport-local'),
			LocalStrategy = passportLocal.Strategy;

const Usuario = require('../models/usuarios');

let localConnection = function (app){

	passport.use('user', new LocalStrategy({
		usernameField : 'usuario',
		passwordField : 'password'
	},
	  function (username, password, done) {
	    Usuario.findOne({ usuario: username }, function(err, user) {
	      	if (err) { return done(err); }


	      	if (!user) {

	        	return done(null, false, { message: 'Incorrect username.' });

	      	}else{

		    	if (user.password != password) {

						return done(null, false, { message: 'Incorrect password.' });

	        	}else{
	        		return done(null, user);
	        	}
	      	}
	    });
	  }
	));

	app.post('/login', passport.authenticate('user', {  successRedirect: '/home', failureRedirect: '/error', failureFlash: 'Usuario o contraseña erróneos'}));

};


module.exports = localConnection;
