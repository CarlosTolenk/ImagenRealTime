const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redis = require('redis');
const client = redis.createClient();

//Aquí almacenamos las variables de sesión
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

//Passport
const passport = require('passport');

//Flash para enviar mensajes temporales como respuesta
var flash = require('connect-flash');

//Logger de peticiones http
const logger = require('morgan');
//Parsea las cookies y pobla el objeto req.cookies con un objeto de llaves, que tiene el nombre de la cookie
const cookieParser = require('cookie-parser');
//Parsea el cuerpo de las peticiones y respuestas http
const bodyParser = require('body-parser');

const path = require('path');
const _ = require('lodash');
const port = process.env.PORT || 3000;


//Requerimos Swig
const swig = require('swig');

var usuarios = [];
var clientes = {};
//var mensajes = [];

const Usuario = require('./models/usuarios');
const Mensaje = require('./models/mensajes');
/**************Configuración**************/

//Con esto le decimos a express, que motor de template utilizar, a lo que asignamos Swig.
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//En desarrollo deshabilitamos el cacheo de templates, pero en un entorno de desarrollo es esencial, para el optimo rendimiento.
//Leccion 4
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Necesario para la gestión de las variables de sesión
app.use(session({
  store : new RedisStore({}),
  secret : 'nextapp'
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

/**************Configuración**************/

passport.serializeUser(function(user, done) {
  console.log("Serialize: "+user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("Deserialize: "+obj);

  done(null, obj);
});

//Routes
var routes = require('./routes/routes');
routes(app);

//Connections
var local = require('./connections/local');
local(app);
var twitter = require('./connections/twitter');
twitter(app);

//Socket.io

function storeMessages(usuario, mensaje){
  //var dato = JSON.stringify();
  /*client.lpush("mensajes", dato, function (err, response){
    client.ltrim("mensajes", 0, 10);
  });*/
  var objeto = new Mensaje({usuario : usuario, mensaje : mensaje});
  objeto.save(function (err, mensaje){
    if (err) {console.log(err);}
    console.log(mensaje);
  });

}

io.on('connection', function(socket){

  socket.on('disconnect', function(){
    console.log('user disconnected');
    client.hdel("usuarios", socket.id);
  });

  socket.on('chat message', function(msj){
  	var match = /@([^@]+)@/.exec(msj.mensaje);

  		if (match != null) {

        client.hgetall("usuarios", function(err, usuarios){
          _.forEach(usuarios, function(x,y){
            console.log(x,y);
            if (x == match[1]) {
              socket.emit('chat message', msj);
              socket.broadcast.in(y).emit('chat message', msj);
            }
          });


        });

  		}else{
        io.emit('chat message', msj);
        console.log(msj);
        storeMessages(msj.usuario, msj.mensaje);
  		}
  });


  socket.on('new user', function(nombre){
    console.log(socket.id);
    client.hset("usuarios", socket.id.toString(), nombre);
    client.hgetall("usuarios", function (err, usuarios){
      io.emit('new user', usuarios);
    });

    Mensaje.find({})
    .exec(function(err, mensajes){
      if (err) {console.log(err);};
      mensajes.forEach(function(mensaje, i){
        socket.emit('chat message', mensaje);
      });
    });
  });

});

server.listen(port, () => {
	console.log(`Servidor corriendo en el puerto ${port}`);
});
