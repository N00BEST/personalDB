const DB = require('./Database');
const util = require('./utilidades');

module.exports.personal = (req, res)=>{
	res.render('Personal');
}

module.exports.detalleUnidad = (req, res)=>{
	let ID = req.params.ID;
	if(typeof ID === 'undefined' || isNaN(ID) || ID.indexOf('.') !== -1) {
		res.sendStatus(404);
	} else {
		DB.Componentes.findOne({
			where: {
				ID: ID
			}
		}).then((componente)=>{
			let resultado = {
				ID: componente.ID,
				nombre: componente.nombre,
				comandante: {
					nombre: componente.comandante,
					grado: componente.gradoComandante,
					fecha: util.parseDate(JSON.stringify(componente.fechaComandante).substr(1, 10))
				},
				segundo: {
					nombre: componente.segundo,
					grado: componente.gradoSegundo,
					fecha: util.parseDate(JSON.stringify(componente.fechaSegundo).substr(1, 10))
				}
			};

			res.render('detallesComponente', resultado);
		}).catch((err)=>{
			console.log(`[ ERRROR ] Ocurrió un error al intentar acceder a los detalles de una unidad. ${err.message}`);
			res.sendStatus(500);
		})
	}
}