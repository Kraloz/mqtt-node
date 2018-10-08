/* IMPORTS */

// dotenv para las variables de entorno
require("dotenv").config();
var env = process.env;

// Sequelize ORM
var Sequelize = require("Sequelize");

// Modelo del sensor
var ModelSensor = require("../models/sensor.js");
var ModelLed = require("../models/led.js");

/* FIN IMPORTS */


// Instanciamos una conexión a la base de datos
const db = new Sequelize(env.DB_NAME, env.DB_USERNAME, "", {
    host: env.DB_HOST,
    dialect: "mysql",
    // To create a pool of connections
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

const Led = ModelLed(db, Sequelize);


// Exports:
module.exports.Sensor = Sensor;
module.exports.Led = Led;