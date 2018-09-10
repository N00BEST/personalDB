var __MESES = [ 'Ene', 'Feb', 'Mar', 'May', 'Abr', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ];

function parseDate(fecha) {
	if(typeof fecha === 'undefined'){
		throw new Error('Fecha es undefined');
	} else {
		let arreglo = fecha.split('-');
		let resultado = arreglo[2] + " "; 
		resultado += __MESES[parseInt(arreglo[1] - 1)] + ' ';

		resultado += arreglo[0];

		return resultado;
	}
}

function barraProgreso(activar){
	//Desplegar u ocultar la barra de progreso.
	let barra = $('#barraProgreso');
	//Quitar la barra
	barra.empty();
	if(activar){
		//Si se requiere activa, se instancia
		let progreso = document.createElement('div');
		let indeterminado = document.createElement('div');

		progreso.className = 'progress';
		indeterminado.className = 'indeterminate';

		$(progreso).append(indeterminado);
		//Se despliega la barra
		barra.append(progreso);
	}
}

function buscar(arreglo, ID){
	let obj = undefined;
	for(let i = 0; i < arreglo.length; i++){
		if(arreglo[i].ID == ID){
			obj = arreglo[i];
			break;
		}
	}
	return obj;
}

function StringFecha(fecha){
	if(typeof fecha === 'undefined'){ 
		throw new Error('Fecha es undefined');
	} else {
		if(fecha.length === 0) {
			return undefined;
		}
		let arreglo = fecha.split(' ');
		let resultado = arreglo[2] + '-';
		let mes = (__MESES.indexOf(arreglo[1]) + 1).toString();
		mes = mes.length === 1 ? '0' + mes : mes;
		resultado += mes + '-' + arreglo[0];
		return resultado;
	}
}