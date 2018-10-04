// @param : db (instancia de Sequelize.js)
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

// exports: ESTE MÓDULO EXPORTA UNA FUNCIÓN (ANÓNIMA) 
//  QUE INSTANCIA EL ESQUEMA DE LOS SENSORES