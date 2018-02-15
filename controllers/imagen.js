var Imagen = require('../models/imagenes');

exports.leerImagen = function(req, res, next){

Imagen.find({}, function(err, imagenes){

  if(err){
    res.send("Ocurrió error obteniendo las imagenes");

  }else{
    res.send(imagenes);
  }
  });
  next();
};

exports.uploadImagen = function(req, res, next){

  if(req.files.miarchivo){
    var tipo = req.files.miarchivo.type;
    if (tipo == 'image/png' || tipo == 'image/jpg' || tipo == 'image/gif' || tipo == 'image/jpeg') {
        var fs = require('fs');
        var tmpPath = req.files.miarchivo.path;
        var targetPath = path.resolve('./public/uploads/');
        var aleatorio = Math.floor((Math.random()*999)+1);
        var nombreArchivo = aleatorio + '-' + req.files.miarchivo.name;

        fs.rename(tmpPath, path.join(targetPath, nombreArchivo), function (err) {
          if(err){
            return res.send('Error en el nombre del archivo o la ruta');
          }
          fs.unlink(tmpPath, function (err) {
            // res.send('El usuario: <strong>' + req.session.passport.user.usuario + '</strong>  subió imagen: <br><a href="/index"><img src="./uploads/'+nombreArchivo+'" />');
              res.render('home', {
                src:'./uploads/'+nombreArchivo,
                usuario: req.session.passport.user.usuario
              });
          });
        });
    } else {
      res.send('El tipo de archivo es inválido');
    }
  } else {
    res.send('No se adjunto archivo.');
  }


	var imagen = new Imagen({
		nombre : req.files.miarchivo.name,
		imagen : req.files.miarchivo.path
	});

	user.save(function (err, imagen){
		if (!err) {
			res.status(201);
			next();
		}else{
			res.status(500);
			res.send('Ha ocurrido un problema!');
		}
	});
};
