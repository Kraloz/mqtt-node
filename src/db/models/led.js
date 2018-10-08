// @param : db (instancia de Sequelize.js)
// @param : type (instancia de la conexión a la base de datos)
module.exports = (db, type) => {
    return db.define("led", {
        id: {
            type: type.INTEGER,
            field: "id",
            primaryKey: true
        },
        estado: {
            type: type.BOOLEAN,
            field:"estado"
        }
    },{
        freezeTableName: true
    });
};

// exports: ESTE MÓDULO EXPORTA UNA FUNCIÓN (ANÓNIMA) 
//  QUE INSTANCIA EL ESQUEMA DE LOS LED