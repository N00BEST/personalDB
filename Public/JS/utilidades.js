function parseDate(fecha) {
	if(typeof fecha === 'undefined'){
		throw new Error('Fecha es undefined');
	} else {
		let arreglo = fecha.split('-');
		let resultado = arreglo[2] + " "; 
		switch(arreglo[1]){
			case '01': 
				resultado += 'Ene ';
			break;

			case '02': 
				resultado += 'Feb ';
			break;

			case '03': 
				resultado += 'Mar ';
			break;

			case '04': 
				resultado += 'Abr ';
			break;

			case '05': 
				resultado += 'May ';
			break;

			case '06': 
				resultado += 'Jun ';
			break;

			case '07': 
				resultado += 'Jul ';
			break;

			case '08': 
				resultado += 'Ago ';
			break;

			case '09': 
				resultado += 'Sep ';
			break;

			case '10': 
				resultado += 'Oct ';
			break;

			case '11': 
				resultado += 'Nov ';
			break;

			case '12': 
				resultado += 'Dic ';
			break;
		}

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