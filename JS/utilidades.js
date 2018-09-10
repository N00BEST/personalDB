var __MESES = [ 'Ene', 'Feb', 'Mar', 'May', 'Abr', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ];

module.exports.parseDate = (fecha)=> {
	if(typeof fecha === 'undefined' || fecha === 'ull'){
		return undefined;
	} else {
		let arreglo = fecha.split('-');
		let resultado = arreglo[2] + " "; 
		resultado += __MESES[parseInt(arreglo[1] - 1)] + ' ';

		resultado += arreglo[0];

		return resultado;
	}
}