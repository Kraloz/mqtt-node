var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.2.108:1883')
var Sequelize = require('Sequelize');

var express = require('express');
var app = express();
var socket = require('socket.io');
var io = socket(server);

var server = app.listen(3000);

app.use(express.static('public'));

io.sockets.on('connection', newConnection);

function newConnection(socket){

}



client.on('connect', function () {

  client.subscribe('/test')
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  var str = message.toString()
  console.log("------------------")
  console.log("RAW: "+ str)
  var obj= JSON.parse(str)

  obj.forEach(function(sensor) {
  	console.log("Parseado:")
  	console.log("ID: "+sensor.id)
  	console.log("Valor: "+sensor.valor)
  	actualizar(sensor)
  	
  	
  });
  
      
})


const sequelize = new Sequelize('olimpiadas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',   
  
  // To create a pool of connections
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
        timestamps: false
    }
});

var Sensor = sequelize.define('sensores', {
  id: {
    type: Sequelize.INTEGER,
    field: 'id', 
    primaryKey: true
  },
  valor: {
    type: Sequelize.INTEGER,
    field:'valor'
  }
}, {
  freezeTableName: true 
});

function actualizar(sensor){
  Sensor.update({
      valor: sensor.valor,
    }, {
      where: {
        id: sensor.id
      }
    })
  .then(() => {mostrar(sensor)});
	

}

function mostrar(sensor){

	Sensor.findById(sensor.id).then(function (elemento) {
		console.log("BD:")
		console.log("ID: "+elemento.id)
		console.log("Valor: "+elemento.valor)
    console.log(typeof sensor)
	});

}



