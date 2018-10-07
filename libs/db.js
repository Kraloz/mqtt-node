/* IMPORTS */

// dotenv para las variables de entorno
require("dotenv").config();
var env = process.env;

// Sequelize ORM
var Sequelize = require("Sequelize");

// Modelo del sensor
var ModelSensor = require("../models/sensor.js");

/* FIN IMPORTS */


// Instanciamos una conexión a la base de datos
const db = new Sequelize(env.DB_NAME, env.DB_USERNAME, "", {
    host: env.DB_HOST,
    dialect: "mysql",
    //logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false
    },
    operatorsAliases: false // con esto evitamos el warning del siguiente issue : https://github.com/sequelize/sequelize/issues/8417#issuecomment-334994778
});


// Se instancia el esquema del modelo Sensor
const Sensor = ModelSensor(db, Sequelize);
// Custom model methods:
Sensor.updateValor = function (json_data, callback) {
    // Se parsea la cadena json a un objeto 
    var data_str = json_data.toString();
    var json_obj= JSON.parse(data_str);
    
    // Se actualiza el valor del sensor que llegó
    this.update({
        valor: json_obj.valor,
    }, {
        where: {
            id: json_obj.id
        }
    });
    // el callback debería ser la función que haga emit de los sensores
    callback();
};


// Exports:
module.exports.Sensor = Sensor;