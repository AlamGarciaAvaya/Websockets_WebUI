/*
Declaramos las contsantes para las librerias que usaremos
express -> ]HTTP Framework
http -> conexiones HTTPS
FS -> lector de Archivos

*/

globalString = undefined;

const express = require('express'),
  http = require('https'),
  fs = require("fs");
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/chain.pem', 'utf8');
/*
Declaramos las constantes para el arreglo options, en el arreglo se apunta hacia la ruta de los certificados.

*/

//Funcion para manipualr Arrays
function quitar(array, element) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/cert.pem', 'utf8'),
  ca: fs.readFileSync('/etc/letsencrypt/live/devavaya.ddns.net/chain.pem', 'utf8')
};

//Declaramos la variable app que tendrá todas las opciones para nuestra aplicacion
// Express
// server (creamos el servidor http con el arreglo de los certificados)
// Declaramos la libreria que suaremos Socket.IO y que escuche las peticiones en el servidor que acabamos de createServer
//
app = express(),
  server = http.createServer(options, app),
  io = require('socket.io').listen(server);
//Al memomento de obtener el directorio raiz del proyecto de NodeJS, declaramaos 2 funciones req (Request) res(Repsonses)
app.get('/', (req, res) => {
  //Al acceder al directorio Raiz como ruta imprimiremos en el Log que el Servidor HTTP está corriendo en el puerto 8080
  res.send('Servidor corriendo en el puerto 8080')
});


app.post('/websockets/audio', function(req, res) {
  res.send('Hello World');
})


app.post('/websockets/tts', function(req, res) {
  res.send('Hello World');
})

app.post('/websockets/pantalla', function(req, res) {
  res.send('Hello World');
})
//Creamos un array de Usuarios Conectados
var connectedUsers = {};
var arr2 = [];

//Llamamos la funcions io.on para declarar los evebtos de nuestro Servidor

//Cuando se Conecta
io.on('connection', function(socket) {
  //Imprimimos en consola que se ha conectado el usuario

  //cuando un usairo se registra y esperamos lo datos en la funcion username
  socket.on('reg', function(username) {
    //registramos un socket con ese username
    socket.username = username;
    //Lo agregamos al array de usuarios conectados
    connectedUsers[username] = socket;
    //imprimimos en consola que este usuario se ha conectado
    globalString = username;

    arr2.push(globalString); // add at the end
    uniqueArray = arr2.filter(function(elem, pos) {
      return arr2.indexOf(elem) == pos;
    });
    console.log("Se ha conectado:" + username);
    console.log(uniqueArray);
    socket.emit('data', {
      to: "9860",
      message: uniqueArray
    });
  });



  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      console.log("Desconección Forzada");
      socket.connect();
    }
    console.log("Se ha desconectado un usuario" + socket.username);


  });

  //funcion p2p (TTS) esperamos los datos (data)
  socket.on('p2p', function(data) {
    //Se imprime en consola los Datos(data) que recibimos del Cliente
    console.log(data);
    //declaramos la constante to y como los datos vienen en formato json podemos acceder a sus propiedades
    const to = data.to,
      message = data.message,
      extra = data.extra;
    //Aqui vemos si el usuario conectado tiene la propiedad to
    if (connectedUsers.hasOwnProperty(to)) {
      //Si la tiene , imprimimos el mensaje
      console.log("enviando a:" + to);
      //Emitimos la señal de p2p al usuario conectado
      connectedUsers[to].emit('p2p', {
        //Con los datos, usario, mensaje y extra (idioma)
        username: socket.username,
        message: message,
        extra: extra
      });
    }
  });


  //funcion tts (TTS) esperamos los datos (data)
  socket.on('tts', function(data) {
    //Se imprime en consola los Datos(data) que recibimos del Cliente
    console.log(data);
    //declaramos la constante to y como los datos vienen en formato json podemos acceder a sus propiedades
    const to = data.to,
      message = data.message,
      sender = data.sender
    //Aqui vemos si el usuario conectado tiene la propiedad to
    if (connectedUsers.hasOwnProperty(to)) {
      //Si la tiene , imprimimos el mensaje
      console.log("enviando a:" + to + " from: " + sender);
      //Emitimos la señal de p2p al usuario conectado
      connectedUsers[to].emit('tts', {
        //Con los datos, usario, mensaje y extra (idioma)
        username: socket.username,
        message: message,
        sender: sender
      });
    }
  });

  socket.on('alert', function(data) {
    console.log(data);
    const to = data.to,
      message = data.message;
    if (connectedUsers.hasOwnProperty(to)) {
      console.log("Se ha conectado:" + to);
      connectedUsers[to].emit('alert', {
        username: socket.username,
        message: message
      });
    }
  });

  socket.on('startvoice', function(data) {
    console.log(data);
    const to = data.to,
      message = data.message;
    if (connectedUsers.hasOwnProperty(to)) {
      console.log("Se ha conectado:" + to);
      connectedUsers[to].emit('alert', {
        username: socket.username,
        message: message
      });
    }
  });

});
//Indicamos que
server.listen(80, () => {

  console.log('Corriendo Server puerto 980')

})
