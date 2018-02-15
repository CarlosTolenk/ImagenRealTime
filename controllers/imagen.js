
const express = require('express');
const app = express();
const path = require('path');
const Imagen = require('../models/imagenes');
const fs = require('fs');


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



	var imagen = new Imagen({
		nombre : req.body.nombre,
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
