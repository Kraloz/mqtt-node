// @param : sequelize (instancia de Sequelize.js)
// @param : type (instancia de la conexión a la base de datos)

module.exports = (db, type) => {

    return db.define("sensores", {
        id: {
            type: type.INTEGER,
            field: "id",
            primaryKey: true
        },
        valor: {
            type: type.INTEGER,
            field:"valor"
        }
    }, {
        freezeTableName: true
    });
};
/*
Sensor.customUpdate = function (sensor){
    Sensor.update({
        valor: sensor.valor,
    }, {
        where: {
            id: sensor.id
        }
    })
        .then(() => { this.customShow(sensor); });
};
Sensor.customShow = function (sensor){
    Sensor.findById(sensor.id)
        .then(function (elemento) {
            console.log("BD:");
            console.log("ID: "+elemento.id);
            console.log("Valor: "+elemento.valor);
            console.log(typeof sensor);
        });
};
*/
