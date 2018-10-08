require("dotenv").config();
var env = process.env;

var mqtt = require("mqtt");
var client  = mqtt.connect(env.MQTT_URI);

client.on("connect", () => {
    console.log("Conectado!");
});

setInterval(() => {
    var Sensor = {id:1,descripcion:"sensor xd",valor:parseInt((Math.random() * (40 - 5)))};
    client.publish("/test", JSON.stringify(Sensor));
    console.log("publicado:");
    console.log(Sensor);
}, 1500);