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
const models = require("./db/db.js");
// Instancias de modelos
var Sensor =  models.Sensor;
var Led = models.Led;

// SchemaValidator
var ajv = require("./db/schemas.js");            

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
    console.log("Servidor corriendo");
});

/* MQTT Listeners */

// Cuando se conecte con el broker, se suscribe al topico "/test"
client.on("connect", () => {
    console.log("Conectado!");
    client.subscribe("/test");
    //client.subscribe("/led");
});


var io_getSensores = function () {    
    Sensor.findAll()
        .then( function (sensores) {
            io.emit("respuestaSensores", {"sensores": sensores});
        });
};
var io_getLeds = function () {
    Led.findAll()
        .then( function(leds){
            //console.log("leds :"+JSON.stringify(leds));
            io.emit("respuestaLeds", {"leds": leds});
            client.publish("/led", JSON.stringify(leds[0]));
        });
};

// Cuando se reciba un SENSOR PARA ACTUALIZAR: 
client.on("message", (topic, message) => {
    // Depende el tópico
    switch(topic){
    case "/test":
        // Parseo el json
        message = JSON.parse(message);
        // valido si el json que me llegó respeta el schema del sensor
        if(ajv.validate("sensorSchema", message)){
            // Si se valida, lo mando para updatear
            try{
                Sensor.updateValor(message);
                io_getSensores();
            }catch(err){
                console.log(err.message);
            }
        }else {
            // Sino logeo el error por cuestiones de debug
            console.log(ajv.errorsText());
        }
    }
});


/* SocketIO Listeners */
io.on("connection", (socket) => {
    socket.on("getSensores", () => {
        io_getSensores(); 
    });
    
    socket.on("switchLed", (msg) => {
        // Validación del JSON que llega
        if(ajv.validate("ledSchema", msg)){
            Led.NOT(msg);
            io_getLeds();
            
        }else{
            // Sino logeo el error por cuestiones de debug
            console.log(ajv.errorsText());
        }
    });
    socket.on("getLed", () => {
        io_getLeds();
    });
    
});