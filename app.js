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

var Led = models.Led;


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

// Funcion que va a usar SocketIO para consultar y emitir todos los sensores y leds

function io_getSensores(){
    
    Sensor.findAll()
        .then( (sensores) => {
            
            
            
            io.emit("respuestaSensores", {"sensores": sensores});
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
    });
    io_getSensores();
}

function updateLed(data){
    
    //se deserealiza 
    var data_deserialized = JSON.stringify(data);
    console.log("Led deseralizado en el updateLed: "+data_deserialized);
    var json_obj= JSON.parse(data_deserialized);
    
    var nuevoEstado;
    
    
    // Se actualiza el valor del led en la base de datos
    if (json_obj[0].estado == 1){
        nuevoEstado = 0;
    }else{
        nuevoEstado = 1;
    }
    console.log("ID del LED: "+json_obj[0].id);
    
    Led.update({
        estado: nuevoEstado,
    }, {
        where: {
            id: json_obj[0].id
        }
    });
    io_getLed();
}

function io_switchLed(){
    Led.findAll()
        .then( (led) => {
            
            updateLed(led);
        })
}

function io_getLed(){
    console.log("Ejecucion de io_getLed");
    Led.findAll()
        .then( (led1) => {
            //Si intento deserializar el Led de Sequelize acá, devuelve cualquier cosa por alguna razon 
            /*var data_deserialized = JSON.stringify(led);
            console.log(data_deserialized[0]);
            client.publish("/led",data_deserialized[0]);*/
            //Pero si paso a una funcion y despues lo deserializo, se hace bien, asi que...¿¿??
            console.log("TODO CHETO");
            sendLed(led1);
        }).catch(function (err) {
            console.log("ERROR: "+err);
          });
}

function sendLed(data){
    var data_deserialized = JSON.stringify(data);
    console.log("WTF: "+data_deserialized);
    client.publish("/led", data_deserialized );
    
    
}


/* Fin funciones handlers */


/* MQTT Listeners */

// Cuando se conecte con el broker, se suscribe al topico "/test"
client.on("connect", () => {
    console.log("Conectado!");
    client.subscribe("/test");
    //client.subscribe("/led");
});


// Cuando se reciba un mensaje 
client.on("message", (topic, message) => {
    updateSensor(message);
});




/* SocketIO Listeners */
io.on("connection", (socket) => {
    socket.on("getSensores", () => {
        io_getSensores();      
    });

    socket.on("switchLed", () => {
        io_switchLed();      
    });

    socket.on("getLed", () => {
        //io_getLed();      
    });
});

