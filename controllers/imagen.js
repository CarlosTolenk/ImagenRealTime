//Importo el Schema de las imagenes y el modulo fileSystems.
const Imagen = require('../models/imagenes');
const fs = require('fs');



// Funcion para leer los datos de la base de dato y enviarselo a la ruta.
exports.readImagen = function(req, res, next){

    Imagen.find({}, function(err, imagenes){

        if(err){
          res.send("A problem has occurred when obtaining the images");

        }else{
          console.log(imagenes);
          res.send(imagenes);
        }
      });
      next();
    };

exports.uploadImagen = function(req, res, next){

  let respuesta = req.files;

console.log("Esto traer req.file " + respuesta);

	var imagen = new Imagen({
		//nombre : req.files.nombre,
		//imagen : req.body.miarchivo
	});

	imagen.save(function (err, imagen){
		if (!err) {
			res.status(201);
			next();
		}else{
			res.status(500);
			res.render(err);
		}
	});
};
