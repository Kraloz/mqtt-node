var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://172.16.2.205:1883')

client.on('connect', function () {
    console.log("Conectado!")
    
})


setInterval(function(){
 	client.publish("/test", "eskere")

}, 3000)