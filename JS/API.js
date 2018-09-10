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
					personal: 0,
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
}

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
				personal: 'No Implementado',
				creacion: filas[i].createdAt
			}
			resultado.push(fila);
		}
		res.send(resultado);
	}).catch((err)=>{
		console.log(`[ ERROR ] Ocurrió un error al intentar recuperar los grados. ${err.message} `);
		res.sendStatus(500);
	});
}

module.exports.getGrado = (req, res)=>{
	let nombre = req.query.nombre;
	let ID = req.query.ID;
	if(typeof nombre === 'undefined' && typeof ID === 'undefined') {
		res.sendStatus(400);
	} else {
		let where = ID ? { ID: ID.trim() } : { nombre: nombre.toLowerCase().trim() };
		DB.Grados.findOne({
			where: where
		}).then((grado)=>{
			if(grado){
				let obj = {
					ID: grado.ID,
					nombre: grado.nombre,
					personal: 'No Implementado',
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
}

module.exports.putGrado = (req, res)=>{
	let nombre = req.body.nombre;
	let nuevo = req.body.nuevo;
	let ID = req.body.ID;
	if(typeof nombre === 'undefined' || typeof nuevo === 'undefined' || typeof ID === 'undefined'
	|| isNaN(ID) || ID.indexOf('.') !== -1){
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
					let resultado = {
						ID: _grado.ID,
						nombre: _grado.nombre,
						personal: 'No Implementado',
						creacion: _grado.createdAt
					}
					res.send(resultado);
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
}

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
					personal: 0,
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
}

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
				personal: 'No Implementado',
				creacion: filas[i].createdAt
			}
			resultado.push(fila);
		}
		res.send(resultado);
	}).catch((err)=>{
		console.log(`[ ERROR ] Ocurrió un error al intentar recuperar los grados. ${err.message} `);
		res.sendStatus(500);
	});
}

module.exports.getEstado = (req, res)=>{
	let nombre = req.query.nombre;
	let ID = req.query.ID;
	if(typeof nombre === 'undefined' && typeof ID === 'undefined') {
		res.sendStatus(400);
	} else {
		let where = ID ? { ID: ID.trim() } : { nombre: nombre.toLowerCase().trim() };
		DB.Estados.findOne({
			where: where
		}).then((estado)=>{
			if(estado){
				let obj = {
					ID: estado.ID,
					nombre: estado.nombre,
					personal: 'No Implementado',
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
}

module.exports.putEstado = (req, res)=>{
	let nombre = req.body.nombre;
	let nuevo = req.body.nuevo;
	let ID = req.body.ID;
	if(typeof nombre === 'undefined' || typeof nuevo === 'undefined' || typeof ID === 'undefined'
	|| isNaN(ID) || ID.indexOf('.') !== -1){
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		nuevo = nuevo.trim();
		DB.Estados.findOne({
			where: {
				ID: ID,
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
}

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
}

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
}

module.exports.getCargo = (req, res)=>{
	let nombre = req.query.nombre;
	let ID = req.query.ID;
	if(typeof nombre === 'undefined' && typeof ID === 'undefined') {
		res.sendStatus(400);
	} else {
		let where = ID ? { ID: ID.trim() } : { nombre: nombre.toLowerCase().trim() };
		DB.Cargos.findOne({
			where: {
				nombre: nombre.toLowerCase()
			}
		}).then((cargo)=>{
			if(cargo){
				let obj = {
					ID: cargo.ID,
					nombre: cargo.nombre,
					activo: 'No Implementado',
					historico: 'No Implementado',
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
}

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
}

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
					personal: 0,
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
}

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
				personal: 'No Implementado',
				creacion: filas[i].createdAt
			}
			resultado.push(fila);
		}
		res.send(resultado);
	}).catch((err)=>{
		console.log(`[ ERROR ] Ocurrió un error al intentar recuperar las clasificaciones. ${err.message} `);
		res.sendStatus(500);
	});
}

module.exports.getClasificacion = (req, res)=>{
	let nombre = req.query.nombre;
	let ID = req.query.ID;
	if(typeof nombre === 'undefined' && typeof ID === 'undefined') {
		res.sendStatus(400);
	} else {
		let where = ID ? { ID: ID.trim() } : { nombre: nombre.toLowerCase().trim() };
		DB.Clasificaciones.findOne({
			where: where
		}).then((clasificacion)=>{
			if(clasificacion){
				let obj = {
					ID: clasificacion.ID,
					nombre: clasificacion.nombre,
					personal: 'No Implementado',
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
}

module.exports.putClasificacion = (req, res)=>{
	let nombre = req.body.nombre;
	let nuevo = req.body.nuevo;
	let ID = req.body.ID;
	if(typeof nombre === 'undefined' || typeof nuevo === 'undefined' || typeof ID === 'undefined'
		|| isNaN(ID) || ID.indexOf('.') !== -1){
		res.sendStatus(400);
	} else {
		nombre = nombre.trim();
		nuevo = nuevo.trim();
		DB.Clasificaciones.findOne({
			where: {
				ID: ID,
				nombre: nombre.toLowerCase()
			}
		}).then((clasificacion)=>{
			if(clasificacion){
				clasificacion.update({
					nombre: nuevo.toLowerCase()
				}).then((_clasificacion)=>{
					let resultado = {
						ID: _clasificacion.ID,
						nombre: _clasificacion.nombre,
						personal: 'No Implementado',
						creacion: _clasificacion.createdAt
					}
					res.send(resultado);
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
}

// - - - - - - MANEJO DE COMPONENTES - - - - - - //

module.exports.postComponente = (req, res)=>{
	let nombre = req.body.nombre;
	let comandante = {
		nombre: req.body.comandante ? req.body.comandante.trim() : '',
		grado: req.body.gradoComandante ? req.body.gradoComandante.trim() : '',
		fecha: req.body.fechaComandante ? req.body.fechaComandante.trim() : ''
	};
	let segundo = {
		nombre: req.body.segundo,
		grado: req.body.gradoSegundo,
		fecha: req.body.fechaSegundo
	};
	let jerarquia = req.body.jerarquia ? req.body.jerarquia.split('#') : [];
	if(typeof nombre === 'undefined' || nombre.length === 0) {
		res.sendStatus(400);
	} else {
		//Validar los ID's de la jerarquia
		//Si todos son válidos, guardar los ID's
		//Registrar el componente y luego asociarlo a los ID's
		let promesas = [];
		let top = jerarquia.length;
		for(let i = 0; i < top; i++){
			let id = jerarquia.shift();
			promesas.push(DB.Grados.findOne({
				where: {
					ID: id
				}
			}));
		}

		Promise.all(promesas).then((valores)=>{
			if(valores.length === 0 || valores.indexOf(null) === -1) {
				nombre = nombre.trim();
				DB.Componentes.findOrCreate({
					where: {
						nombre: nombre
					}, 
					defaults: {
						nombre: nombre,
						comandante: comandante.nombre,
						gradoComandante: comandante.grado,
						fechaComandante: comandante.fecha || null,
						segundo: segundo.nombre,
						gradoSegundo: segundo.grado,
						fechaSegundo: segundo.fecha || null
					}
				}).then((arreglo)=>{
					if(arreglo[1]){
						//Si fue creado
						let resultado = {
							ID: arreglo[0].ID,
							nombre: arreglo[0].nombre,
							comandante: {
								nombre: arreglo[0].comandante,
								grado: arreglo[0].gradoComandante,
								fecha: arreglo[0].fechaComandante
							},
							segundo: {
								nombre: arreglo[0].segundo,
								grado: arreglo[0].gradoSegundo,
								fecha: arreglo[0].fechaSegundo
							},
							grados: []
						}
						let tope = valores.length;
						let componenteID = arreglo[0].ID;
						for(let i = 0; i < tope; i++) {
							let grado = valores.shift();
							resultado.grados.push({
								ID: grado.ID,
								nombre: grado.nombre
							});
							DB.Jerarquias.create({
								mando: i + 1,
								componenteID: componenteID,
								gradoID: grado.ID
							}).then(()=>{}).catch((err)=>{
								console.log(`[ ERROR ] Ocurrió un error al relacionar la jerarquia. ${err.message} `);
							});
						}
						res.send(resultado);						
					} else {
						//Si fue encontrado
						res.sendStatus(409);
					}
				}).catch((err)=>{
					console.log(`[ ERROR ] Ocurrió un error al intentar crear un componente. ${err.message} `);
					res.sendStatus(500);
				});
			} else {
				res.sendStatus(400);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al consultar las jerarquías. ${err.message} `);
			res.sendStatus(500);
		});
	}
}

module.exports.getComponentes = (req, res)=>{
	DB.Componentes.findAll().then((componentes)=>{
		let resultado = [];
		let tope = componentes.length;
		for(let i = 0; i < tope; i++) {
			let componente = componentes.shift();
			resultado.push({
				ID: componente.ID,
				nombre: componente.nombre,
				creacion: componente.createdAt
			});
		}
		res.send(resultado);
	}).catch((err)=>{
		console.log(`[ ERROR ] Ocurrió un error al consultar los componentes. ${err.message} `);
		res.sendStatus(500);
	})
}

module.exports.getComponente = (req, res)=>{
	//Extraer posibles datos de interés
	let nombre = req.query.nombre;
	let ID = req.query.ID;
	if(typeof nombre === 'undefined' && typeof ID === 'undefined') {
		res.sendStatus(400);
	} else {
		//Si se proporciona ID, buscar por ID, de otra forma, buscar por nombre
		let where = ID ? { ID: ID.trim() } : { nombre: nombre.toLowerCase().trim() };
		//Buscar el elemento que coincida con la query
		DB.Componentes.findOne({
			where: where
		}).then((componente)=>{
			//Al finalizar la query
			if(componente){
				//Si se encuentra el componente
				let obj = {
					ID: componente.ID,
					nombre: componente.nombre,
					comandante: {
						nombre: componente.comandante,
						grado: componente.gradoComandante,
						fecha: componente.fechaComandante
					},
					segundo: {
						nombre: componente.segundo,
						grado: componente.gradoSegundo,
						fecha: componente.fechaSegundo
					},
					grados: [],
					creacion: componente.createdAt
				}
				//Buscar los grados relacionados con ese componente ordenados por cadena de mando
				DB.Jerarquias.findAll({
					where: {
						componenteID: componente.ID
					},
					order: [
						['mando', 'ASC']
					]
				}).then((jerarquia)=>{
					//Al finalizar la query
					let promesas = [];
					let tope = jerarquia.length;
					for(let i = 0; i < tope; i++) {
						let relacion = jerarquia.shift();
						//Buscar en Grados todos los grados que están en la jerarquía
						promesas.push(DB.Grados.findOne({
							where: {
								ID: relacion.gradoID
							}
						}));
					}
					//Esperar a que todas las querys de jerarquia se terminen
					Promise.all(promesas).then((grados)=>{
						let top = grados.length;
						for(let i = 0; i < top; i++) {
							let grado = grados.shift();
							obj.grados.push({
								ID: grado.ID,
								nombre: grado.nombre
							});
						}
						//Enviar resultado
						res.send(obj);
					}).catch((err)=>{
						console.log(`[ ERROR ] Ocurrió un error al recuperar un componente. ${err.message} `);
						res.sendStatus(500);
					});
				}).catch((err)=>{
					console.log(`[ ERROR ] Ocurrió un error al recuperar la jerarquía. ${err.message} `);
					res.sendStatus(500);
				});
			} else {
				res.sendStatus(404);
			}
		}).catch((err)=>{
			console.log(`[ ERROR ] Ocurrió un error al recuperar un componente. ${err.message} `);
			res.sendStatus(500);
		});
	}
}

module.exports.putComponente = (req, res)=>{
	let nombre = req.body.nombre;
	let ID = req.body.ID;
	let nuevo = req.body.nuevo;
	let comandante = {
		nombre: req.body.comandante,
		grado: req.body.gradoComandante,
		fecha: req.body.fechaComandante
	}
	let segundo = {
		nombre: req.body.segundo,
		grado: req.body.gradoSegundo,
		fecha: req.body.fechaSegundo
	}
	if(typeof nombre === 'undefined' || typeof ID === 'undefined' || isNaN(ID) || ID.indexOf('.') !== -1
		|| (typeof nuevo === 'undefined' && typeof comandante.nombre === 'undefined' && typeof comandante.grado === 'undefined'
		&& typeof comandante.fecha === 'undefined' && typeof segundo.nombre === 'undefined' && typeof segundo.grado === 'undefined'
		&& typeof segundo.fecha === 'undefined')){
			res.sendStatus(400);
	} else{
		console.log('Mejor en el else');
		res.sendStatus(200);
	}
}