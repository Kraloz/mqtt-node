var Ajv = require("ajv");
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));

// Esquemas DB
const sensorSchema = require("./schemas/sensor.json");

ajv.addSchema(sensorSchema, "sensorSchema");

module.exports = ajv;