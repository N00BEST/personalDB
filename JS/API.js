const DB = require('./Database');

// - - - - - - MANEJO DE GRADOS - - - - - - //

module.exports.postGrado = (req, res)=> {
	//Obtener nombre a registrar
	let nombre = req.body.nombre; 
	//Si no definen nombre, enviar error 400
	if(typeof nombre === 'undefined') {
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		//Buscar o crear un grado llamado como nombre
		DB.Grados.findOrCreate({
			where: {
				nombre: nombre.toLowerCase()
			},
			defaults: {
				nombre: nombre.toLowerCase()
			}
		}).then((arreglo)=>{
			//En arrego[0] la fila, en arreglo[1] si fue creado o no.
			if(arreglo[1]){
				//En caso de haber sido creado
				let resultado = {
					ID: arreglo[0].ID,
					nombre: arreglo[0].nombre,
					activo: 0,
					historico: 0,
					creacion: arreglo[0].createdAt
				}
				res.statusCode = 201;
				res.statusMessage = 'Created';
				res.content = 'json';
				res.send(resultado);
			} else {
				//En caso de que ya existiera
				res.sendStatus(409);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al intentar crear un grado. ${err.message} `);
			res.sendStatus(500);
		})
	}
};

module.exports.getGrados = (req, res)=>{
	let fecha = req.query.fecha;
	let orden;
	if(fecha){
		orden = 'createdAt';
	} else {
		orden = 'nombre';
	}
	DB.Grados.findAll({
		order: [
			[orden, 'ASC']
		]
	}).then((filas)=>{
		let resultado = [];
		for(let i = 0; i < filas.length; i++) {
			let fila = {
				ID: filas[i].ID,
				nombre: filas[i].nombre, 
				activo: 'No Implementado',
				historico: 'No Implementado',
				creacion: filas[i].createdAt
			}
			resultado.push(fila);
		}
		res.send(resultado);
	}).catch((err)=>{
		console.log(`[ ERROR ] Ocurrió un error al intentar recuperar los grados. ${err.message} `);
		res.sendStatus(500);
	});
};

module.exports.getGrado = (req, res)=>{
	let nombre = req.query.nombre;
	if(typeof nombre === 'undefined') {
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		DB.Grados.findOne({
			where: {
				nombre: nombre.toLowerCase()
			}
		}).then((grado)=>{
			if(grado){
				let obj = {
					ID: grado.ID,
					nombre: grado.nombre,
					creacion: grado.createdAt
				}
				res.send(obj);
			} else {
				res.sendStatus(404);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al recuperar un grado. ${err.message} `);
			res.sendStatus(500);
		});
	}
};

module.exports.putGrado = (req, res)=>{
	let nombre = req.query.nombre;
	let nuevo = req.query.nuevo;
	if(typeof nombre === 'undefined' || typeof nuevo === 'undefined'){
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		nuevo = nuevo.trim();
		DB.Grados.findOne({
			where: {
				nombre: nombre.toLowerCase()
			}
		}).then((grado)=>{
			if(grado){
				grado.update({
					nombre: nuevo.toLowerCase()
				}).then((_grado)=>{
					res.sendStatus(200);
				}).catch((err)=>{
					console.log(`[ ERROR ] Ocurrió un error al intentar modificar un grado. ${err.message} `);
					res.sendStatus(500);
				});
			} else {
				res.sendStatus(404);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al intentar recuperar un grado para modificarlo. ${err.message} `);
			res.sendStatus(500);
		});
	}
};

// - - - - - - MANEJO DE ESTADOS - - - - - - //

module.exports.postEstado = (req, res)=> {
	//Obtener nombre a registrar
	let nombre = req.body.nombre; 
	//Si no definen nombre, enviar error 400
	if(typeof nombre === 'undefined') {
		res.sendStatus(400);
	} else {
		nombre.trim();
		//Buscar o crear un estado llamado como nombre
		DB.Estados.findOrCreate({
			where: {
				nombre: nombre.toLowerCase()
			},
			defaults: {
				nombre: nombre.toLowerCase()
			}
		}).then((arreglo)=>{
			//En arrego[0] la fila, en arreglo[1] si fue creado o no.
			if(arreglo[1]){
				//En caso de haber sido creado
				let resultado = {
					ID: arreglo[0].ID,
					nombre: arreglo[0].nombre,
					activo: 0,
					historico: 0,
					creacion: arreglo[0].createdAt
				}
				res.statusCode = 201;
				res.statusMessage = 'Created';
				res.content = 'json';
				res.send(resultado);
			} else {
				//En caso de que ya existiera
				res.sendStatus(409);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al intentar crear un estado. ${err.message} `);
			res.sendStatus(500);
		})
	}
};

module.exports.getEstados = (req, res)=>{
	let fecha = req.query.fecha;
	let orden;
	if(fecha){
		orden = 'createdAt';
	} else {
		orden = 'nombre';
	}
	DB.Estados.findAll({
		order: [
			[orden, 'ASC']
		]
	}).then((filas)=>{
		let resultado = [];
		for(let i = 0; i < filas.length; i++) {
			let fila = {
				ID: filas[i].ID,
				nombre: filas[i].nombre, 
				creacion: filas[i].createdAt
			}
			resultado.push(fila);
		}
		res.send(resultado);
	}).catch((err)=>{
		console.log(`[ ERROR ] Ocurrió un error al intentar recuperar los grados. ${err.message} `);
		res.sendStatus(500);
	});
};

module.exports.getEstado = (req, res)=>{
	let nombre = req.query.nombre;
	if(typeof nombre === 'undefined') {
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		DB.Estados.findOne({
			where: {
				nombre: nombre.toLowerCase()
			}
		}).then((estado)=>{
			if(estado){
				let obj = {
					ID: estado.ID,
					nombre: estado.nombre,
					creacion: estado.createdAt
				}
				res.send(obj);
			} else {
				res.sendStatus(404);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al recuperar un estado. ${err.message} `);
			res.sendStatus(500);
		});
	}
};

module.exports.putEstado = (req, res)=>{
	let nombre = req.body.nombre;
	let nuevo = req.body.nuevo;
	if(typeof nombre === 'undefined' || typeof nuevo === 'undefined'){
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		nuevo = nuevo.trim();
		DB.Estados.findOne({
			where: {
				nombre: nombre.toLowerCase()
			}
		}).then((estado)=>{
			if(estado){
				estado.update({
					nombre: nuevo.toLowerCase()
				}).then((_estado)=>{
					let resultado = {
						ID: _estado.ID,
						nombre: _estado.nombre,
						personal: 'No Implementado',
						creacion: _estado.createdAt
					}
					res.send(resultado);
				}).catch((err)=>{
					console.log(`[ ERROR ] Ocurrió un error al intentar modificar un estado. ${err.message} `);
					res.sendStatus(500);
				});
			} else {
				res.sendStatus(404);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al intentar recuperar un estado para modificarlo. ${err.message} `);
			res.sendStatus(500);
		});
	}
};

// - - - - - - MANEJO DE CARGOS - - - - - - //

module.exports.postCargo = (req, res)=> {
	//Obtener nombre a registrar
	let nombre = req.body.nombre; 
	//Si no definen nombre, enviar error 400
	if(typeof nombre === 'undefined' || nombre.length === 0) {
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		//Buscar o crear un cargo llamado como nombre
		DB.Cargos.findOrCreate({
			where: {
				nombre: nombre.toLowerCase()
			},
			defaults: {
				nombre: nombre.toLowerCase()
			}
		}).then((arreglo)=>{
			//En arrego[0] la fila, en arreglo[1] si fue creado o no.
			if(arreglo[1]){
				//En caso de haber sido creado
				let resultado = {
					ID: arreglo[0].ID,
					nombre: arreglo[0].nombre,
					activo: 0,
					historico: 0,
					creacion: arreglo[0].createdAt
				}
				res.statusCode = 201;
				res.statusMessage = 'Created';
				res.content = 'json';
				res.send(resultado);
			} else {
				//En caso de que ya existiera
				res.sendStatus(409);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al intentar crear un cargo. ${err.message} `);
			res.sendStatus(500);
		})
	}
};

module.exports.getCargos = (req, res)=>{
	let fecha = req.query.fecha;
	let orden;
	if(fecha){
		orden = 'createdAt';
	} else {
		orden = 'nombre';
	}
	DB.Cargos.findAll({
		order: [
			[orden, 'ASC']
		]
	}).then((filas)=>{
		let resultado = [];
		for(let i = 0; i < filas.length; i++) {
			let fila = {
				ID: filas[i].ID,
				nombre: filas[i].nombre, 
				activo: 'No Implementado',
				historico: 'No Implementado',
				creacion: filas[i].createdAt
			}
			resultado.push(fila);
		}
		res.send(resultado);
	}).catch((err)=>{
		console.log(`[ ERROR ] Ocurrió un error al intentar recuperar los cargos. ${err.message} `);
		res.sendStatus(500);
	});
};

module.exports.getCargo = (req, res)=>{
	let nombre = req.query.nombre;
	if(typeof nombre === 'undefined') {
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		DB.Cargos.findOne({
			where: {
				nombre: nombre.toLowerCase()
			}
		}).then((cargo)=>{
			if(cargo){
				let obj = {
					ID: cargo.ID,
					nombre: cargo.nombre,
					creacion: cargo.createdAt
				}
				res.send(obj);
			} else {
				res.sendStatus(404);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al recuperar un cargo. ${err.message} `);
			res.sendStatus(500);
		});
	}
};

module.exports.putCargo = (req, res)=>{
	console.log('Nueva solicitud por aquí');
	let nombre = req.body.nombre;
	let nuevo = req.body.nuevo;
	let ID = req.body.ID;
	console.log(nombre + ' ' + nuevo + ' ' + ID);
	if(typeof nombre === 'undefined' || typeof nuevo === 'undefined' || typeof ID === 'undefined' || isNaN(ID) || ID.indexOf('.') !== -1){
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		nuevo = nuevo.trim();
		DB.Cargos.findOne({
			where: {
				ID: ID,
				nombre: nombre.toLowerCase()
			}
		}).then((cargo)=>{
			if(cargo){
				cargo.update({
					nombre: nuevo.toLowerCase()
				}).then((_cargo)=>{
					let resultado = {
						ID: _cargo.ID,
						nombre: _cargo.nombre,
						activo: 'No Implementado',
						historico: 'No Implementado',
						creacion: _cargo.createdAt
					}
					res.send(resultado);
				}).catch((err)=>{
					console.log(`[ ERROR ] Ocurrió un error al intentar modificar un cargo. ${err.message} `);
					res.sendStatus(500);
				});
			} else {
				res.sendStatus(404);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al intentar recuperar un cargo para modificarlo. ${err.message} `);
			res.sendStatus(500);
		});
	}
};

// - - - - - - MANEJO DE CLASIFICACIONES - - - - - - //

module.exports.postClasificacion = (req, res)=> {
	//Obtener nombre a registrar
	let nombre = req.body.nombre; 
	//Si no definen nombre, enviar error 400
	if(typeof nombre === 'undefined') {
		res.sendStatus(400);
	} else {
		nombre.trim();
		//Buscar o crear una clasificación llamado como nombre
		DB.Clasificaciones.findOrCreate({
			where: {
				nombre: nombre.toLowerCase()
			},
			defaults: {
				nombre: nombre.toLowerCase()
			}
		}).then((arreglo)=>{
			//En arrego[0] la fila, en arreglo[1] si fue creado o no.
			if(arreglo[1]){
				//En caso de haber sido creado
				let resultado = {
					ID: arreglo[0].ID,
					nombre: arreglo[0].nombre,
					activo: 0,
					historico: 0,
					creacion: arreglo[0].createdAt
				}
				res.statusCode = 201;
				res.statusMessage = 'Created';
				res.content = 'json';
				res.send(resultado);
			} else {
				//En caso de que ya existiera
				res.sendStatus(409);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al intentar crear una clasificación. ${err.message} `);
			res.sendStatus(500);
		})
	}
};

module.exports.getClasificaciones = (req, res)=>{
	let fecha = req.query.fecha;
	let orden;
	if(fecha){
		orden = 'createdAt';
	} else {
		orden = 'nombre';
	}
	DB.Clasificaciones.findAll({
		order: [
			[orden, 'ASC']
		]
	}).then((filas)=>{
		let resultado = [];
		for(let i = 0; i < filas.length; i++) {
			let fila = {
				ID: filas[i].ID,
				nombre: filas[i].nombre, 
				creacion: filas[i].createdAt
			}
			resultado.push(fila);
		}
		res.send(resultado);
	}).catch((err)=>{
		console.log(`[ ERROR ] Ocurrió un error al intentar recuperar las clasificaciones. ${err.message} `);
		res.sendStatus(500);
	});
};

module.exports.getClasificacion = (req, res)=>{
	let nombre = req.query.nombre;
	if(typeof nombre === 'undefined') {
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		DB.Clasificaciones.findOne({
			where: {
				nombre: nombre.toLowerCase()
			}
		}).then((clasificacion)=>{
			if(clasificacion){
				let obj = {
					ID: clasificacion.ID,
					nombre: clasificacion.nombre,
					creacion: clasificacion.createdAt
				}
				res.send(obj);
			} else {
				res.sendStatus(404);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al recuperar una clasificación. ${err.message} `);
			res.sendStatus(500);
		});
	}
};

module.exports.putClasificacion = (req, res)=>{
	let nombre = req.query.nombre;
	let nuevo = req.query.nuevo;
	if(typeof nombre === 'undefined' || typeof nuevo === 'undefined'){
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		nuevo = nuevo.trim();
		DB.Clasificaciones.findOne({
			where: {
				nombre: nombre.toLowerCase()
			}
		}).then((clasificacion)=>{
			if(clasificacion){
				clasificacion.update({
					nombre: nuevo.toLowerCase()
				}).then((_clasificacion)=>{
					res.sendStatus(200);
				}).catch((err)=>{
					console.log(`[ ERROR ] Ocurrió un error al intentar modificar una clasificación. ${err.message} `);
					res.sendStatus(500);
				});
			} else {
				res.sendStatus(404);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al intentar recuperar una clasificación para modificarla. ${err.message} `);
			res.sendStatus(500);
		});
	}
};