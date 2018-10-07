/* IMPORTS */

// dotenv para las variables de entorno
require("dotenv").config();
var env = process.env;

// Express framework
var express = require("express");
var app = express();
// Enrutador de express
var r_index = require("./routes/index.js");

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
var models = require("./libs/db.js");
// Instancias de modelos
var Sensor =  models.Sensor;


// SocketIO para comunicación "ws" cliente-servidor
var SocketIO = require("socket.io");
var io = SocketIO(server);

/* FIN IMPORTS */

//Enrutamiento
app.use("/", r_index);
// Exponemos la carpeta public como recurso estático
app.use(express.static("public"));

// Ponemos a correr el servidor en el puerto 3000
server.listen(3000, "0.0.0.0", function() {
    console.log("Servidor corriendo en http://localhost:3000");
});

/* MQTT Listeners */

// Cuando se conecte con el broker, se suscribe al topico "/test"
client.on("connect", () => {
    console.log("Conectado!");
    client.subscribe("/test");
});


// definición de función "callback" para hacer query->emit de los sensores
var io_getSensores = function () {    
    Sensor.findAll()
        .then( function (sensores) {
            io.emit("respuestaSensores", {"sensores": sensores});
        });
};    
// Cuando se reciba un mensaje 
client.on("message", (topic, message) => {
    Sensor.updateValor(message, io_getSensores);
});


/* SocketIO Listeners */
// Se maneja la conexión
io.on("connection", function() {    
    io.on("getSensores", function() {
        io_getSensores();
    });
});