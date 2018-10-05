/* IMPORTS */

// dotenv para las variables de entorno
require("dotenv").config();
var env = process.env;

// Express framework
var express = require("express");
var app = express();

// Server http, al cual le pasamos la app de Express
var server = require("http").Server(app);

// Mqtt para la comunicación con el Broker
var mqtt = require("mqtt");
try {
    var client  = mqtt.connect(env.MQTT_URI);
}
catch(err) {
    console.log(err.message);
}

// Modelos BD
var models = require("./libs/sequelize.js");
// Instancias de modelos
var Sensor =  models.Sensor;


// SocketIO para comunicación "ws" cliente-servidor
var SocketIO = require("socket.io");
var io = SocketIO(server);

/* FIN IMPORTS */


// Cosas de server

// Exponemos la carpeta public como recurso estático
app.use(express.static("public"));

// Ponemos a correr el servidor en el puerto 3000
server.listen(3000, function() {
    console.log("Servidor corriendo en http://localhost:3000");
});


/* Enrutamiento */

// Vista principal
app.get("/", function(req, res) {
    res.sendFile(__dirname +"/views/index.html");
});


/* Funciones handlers */

// Funcion que va a usar SocketIO para consultar y emitir todos los sensores

// ESTO NO ANDA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA (todavía)
// capaz que después de un try-catch devuelva un true-false y si es true entonces hago socket.emit desde la función del canal? idk
function io_getSensores(socket){
    Sensor.findAll()
        .then( (sensores) => {
            var json_sensores = JSON.stringify(sensores);
            socket.emit("respuestaSensores", json_sensores);
        });
}


// Función genérica que recibe un JSON(Sensor) y actualiza el valor en la DB
function updateSensor(data){
    // Se parsea la cadena json a un objeto 
    var data_deserialized = data.toString();
    var json_obj= JSON.parse(data_deserialized);
    
    // Se actualiza el valor del sensor que llegó
    Sensor.update({
        valor: json_obj.valor,
    }, {
        where: {
            id: json_obj.id
        }
        // acá debería poder llamar a io_getSensores() y pasarle socket, PEEERO, al pasarlo como parámetro, socket deja de existir.
    });
}
/* Fin funciones handlers */


/* MQTT Listeners */

// Cuando se conecte con el broker, se suscribe al topico "/test"
client.on("connect", () => {
    console.log("Conectado!");
    client.subscribe("/test");
});


// Cuando se reciba un mensaje 
client.on("message", (topic, message) => {
    updateSensor(message);
});



/* SocketIO Listeners */

io.on("connection", (socket) => {
    // acá debería poder llamar a io_getSensores() y pasarle socket, PEEERO, al pasarlo como parámetro, socket deja de existir.
    // osea: ->
    socket.on("getSensores", () => {
        Sensor.findAll()
            .then( (sensores) => {
                // -> acá socket no estaría funcionando
                socket.emit("respuestaSensores", {"sensores": sensores});
            });        
    });
});

