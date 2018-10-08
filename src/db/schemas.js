var Ajv = require("ajv");
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));

// Esquemas DB
const sensorSchema = require("./schemas/sensor.json");
const ledSchema = require("./schemas/led.json");

ajv.addSchema(sensorSchema, "sensorSchema");
ajv.addSchema(ledSchema, "ledSchema");

module.exports = ajv;