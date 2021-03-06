const Sequelize = require('sequelize');

const database = new Sequelize('lhgTest', 'empleado', 'randomPass', {
	host: 'localhost',
	dialect: 'mysql',
	operatorsAliases: false,
	pool: {
		max: 1000,
		min: 0,
		acquire: 30000,
		idle: 10000
	}, 
	logging: false
});

// ------ INCIO DEL MODELADO DE DATOS ------ //

// GRADOS (ID, nombre)
const Grados = database.define('grado', {
	//Atributos
	ID: {
		type: Sequelize.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: {
		type: Sequelize.STRING(200),
		unique: true
	}
});

// ESTADOS
const Estados = database.define('estado', {
	ID: {
		type: Sequelize.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: {
		type: Sequelize.STRING(200),
		unique: true
	}
});

// CLASIFICACIÓN
const Clasificaciones = database.define('clasificacione', {
	ID: {
		type: Sequelize.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: {
		type: Sequelize.STRING(200),
		unique: true
	}
});

// CARGOS 
const Cargos = database.define('cargo', {
	ID: {
		type: Sequelize.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: {
		type: Sequelize.STRING(200),
		unique: true
	}
});






// SINCRONIZACIÓN DE LAS TABLAS 

Grados.sync({force: false}).then(()=>{
	console.log('[ ÉXITO ] Tabla Grados sincronizada con éxito');
}).catch((err)=>{
	console.log(`[ ERROR ] Tabla Grados no se pudo sincronizar. ${err.message}`);
});

Estados.sync({force: false}).then(()=>{
	console.log('[ ÉXITO ] Tabla Estados sincronizada con éxito');
}).catch((err)=>{
	console.log(`[ ERROR ] Tabla Estados no se pudo sincronizar. ${err.message}`);
});

Clasificaciones.sync({force: false}).then(()=>{
	console.log('[ ÉXITO ] Tabla Clasificaciones sincronizada con éxito');
}).catch((err)=>{
	console.log(`[ ERROR ] Tabla Clasificaciones no se pudo sincronizar. ${err.message}`);
});

Cargos.sync({force: false}).then(()=>{
	console.log('[ ÉXITO ] Tabla Cargos sincronizada con éxito');
}).catch((err)=>{
	console.log(`[ ERROR ] Tabla Cargos no se pudo sincronizar. ${err.message}`);
});





// EXPORTACIÓN DE LAS TABLAS
module.exports.Grados = Grados;
module.exports.Estados = Estados;
module.exports.Clasificaciones = Clasificaciones;
module.exports.Cargos = Cargos;