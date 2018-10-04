/* IMPORTS */

// dotenv para las variables de entorno
require("dotenv").config();
var env = process.env;

// Express para el webserver
var express = require("express");
var app = express();

// Mqtt para la comunicación con el Broker
var mqtt = require("mqtt");
var client  = mqtt.connect(env.MQTT_URI);

// BD:
// Modelo de Sensor
var models = require("./libs/sequelize.js");
var Sensor =  models.Sensor;

// TODO : Comunicación socketIO
// var socket = require("socket.io");
// var io = socket(server);

/* FIN IMPORTS */

// Ponemos a correr el servidor en el puerto 3000
app.listen(3000);
app.use(express.static("public"));

// MQTT Listeners

// Cuando se conecte con el broker, se suscribe al topico "/test"
client.on("connect", function () {
    client.subscribe("/test");
});

// Cuando se reciba un mensaje 
client.on("message", function (topic, message) {
    
    // Se parsea la cadena json a un objeto 
    var str = message.toString();
    var json_obj= JSON.parse(str);
    
    // Se actualiza el valor del sensor que llegó
    Sensor.update({
        valor: json_obj.valor,
    }, {
        where: {
            id: json_obj.id
        }
    })
});