var Sequelize = require('Sequelize');

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
	});

}

function mostrar(){
	Sensor.findAll().then(function (sensores) {

		sensores.forEach(function(elemento) {

		  console.log(elemento.dataValues)
		});

	});


}

