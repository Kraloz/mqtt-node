require("dotenv").config();
var env = process.env;

var mqtt = require("mqtt");
var client  = mqtt.connect(env.MQTT_URI);

client.on("connect", () => {
    console.log("Conectado!");
});
var i = 0;
setInterval(() => {
    i = Math.floor((Math.random() * 30) + 20); 
    var Sensor = {id:1,valor:i};
    

    client.publish("/test", JSON.stringify(Sensor));
    

    console.log("publicado:");
    console.log(Sensor);

}, 1500);