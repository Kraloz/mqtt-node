var express = require("express");
var app = express();

var env = process.env;


var mqtt = require("mqtt");
var client  = mqtt.connect(env.MQTT_URI);

var Sensor = require("./models/sequelize.js");

// var socket = require("socket.io");
// var io = socket(server);

app.listen(3000);
app.use(express.static("public"));

client.on("connect", function () {
    client.subscribe("/test");
});
client.on("message", function (topic, message) {
    // message is Buffer
    var str = message.toString();
    var json_obj= JSON.parse(str);
    
    Sensor.update({
        valor: json_obj.valor,
    }, {
        where: {
            id: json_obj.id
        }
    }).then(() => { 
        console.log("good");
    });    
});