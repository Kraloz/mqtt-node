var Sequelize = require("Sequelize");
var ModelSensor = require("./sensor.js");

require("dotenv").config();
var env = process.env;

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
    }
});

const Sensor = ModelSensor(db, Sequelize);

module.exports = Sensor;