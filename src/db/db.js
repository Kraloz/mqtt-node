/* IMPORTS */
// dotenv para las variables de entorno
require("dotenv").config();
var env = process.env;

// Sequelize ORM
var Sequelize = require("Sequelize");

// Modelo del sensor
var ModelSensor = require("./models/sensor.js");
var ModelLed = require("./models/led.js");
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
Sensor.updateValor = function (data) {    
    // Se actualiza el valor del sensor que llegó (objeto que ya está parseado validado de antes)
    this.update({
        valor: data.valor,
    }, {
        where: {
            id: data.id
        }
    });
};
// Se instancia el esquema del modelo Led
const Led = ModelLed(db, Sequelize);
// Custom model methods:
Led.NOT = function (data) {
    // Se actualiza el valor del sensor que llegó (objeto que ya está parseado validado de antes)
    this.findById(data.id)
        .then( function (led) {
            Led.update({
                estado: !led.estado,
            }, {
                where: {
                    id: led.id
                }
            });
        })
        .catch( (err) => console.log(err.message));    
};

// Exports:
module.exports.Sensor = Sensor;
module.exports.Led = Led;