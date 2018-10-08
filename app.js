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
    console.log("Servidor corriendo en http://localhost:3000");
});


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


/* MQTT Listeners */

// Cuando se conecte con el broker, se suscribe al topico "/test"
client.on("connect", () => {
    console.log("Conectado!");
    client.subscribe("/test");
    //client.subscribe("/led");
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
    // Depende el tópico
    switch(topic){
    case "/test":
        // Parseo el json
        message = JSON.parse(message);
        // valido si el json que me llegó respeta el schema del sensor
        if(ajv.validate("sensorSchema", message)){
            // Si se valida, lo mando para updatear
            Sensor.updateValor(message, io_getSensores);
        }else {
            // Sino logeo el error por cuestiones de debug
            console.log(ajv.errorsText());
        }
    }
});

/* SocketIO Listeners */

io.on("connection", (socket) => {
    // acá debería poder llamar a io_getSensores() y pasarle socket, PEEERO, al pasarlo como parámetro, socket deja de existir.
    // osea: ->
    
    io.on("getSensores", () => {
        io_getSensores();      
    });

    socket.on("switchLed", () => {
        io_switchLed();      
    });

    socket.on("getLed", () => {
        //io_getLed();      
    });
});